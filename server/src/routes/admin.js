
import { Router } from 'express';
import Car from '../models/Car.js';
import Booking from '../models/Booking.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = Router();

router.use(protect, adminOnly);

const fields = [
  'name',
  'brand',
  'category',
  'year',
  'seats',
  'transmission',
  'fuelType',
  'pricePerDay',
  'image',
  'description',
  'available'
];

function clean(body) {
  const out = {};

  for (const key of fields) {
    if (body[key] !== undefined) {
      out[key] = body[key];
    }
  }

  if (
    out.image &&
    !/^https?:\/\//i.test(out.image)
  ) {
    throw Object.assign(
      new Error('Image must be an http or https URL.'),
      { status: 400 }
    );
  }

  return out;
}

// Get all bookings
router.get('/bookings', async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('car', 'name image')
      .sort({ createdAt: -1 })
      .limit(500);

    res.json({ bookings });
  } catch (e) {
    next(e);
  }
});

// Update booking status
router.patch('/bookings/:id/status', async (req, res, next) => {
  try {
    const allowed = [
      'pending',
      'confirmed',
      'cancelled',
      'completed'
    ];

    if (!allowed.includes(req.body.status)) {
      return res.status(400).json({
        message: 'Invalid booking status.'
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found.'
      });
    }

    if (req.body.status === 'confirmed') {
      const overlap = await Booking.exists({
        _id: { $ne: booking._id },
        car: booking.car,
        status: { $in: ['pending', 'confirmed'] },
        pickupDate: { $lt: booking.returnDate },
        returnDate: { $gt: booking.pickupDate }
      });

      if (overlap) {
        return res.status(409).json({
          message: 'Another active booking overlaps these dates.'
        });
      }
    }

    booking.status = req.body.status;
    await booking.save();

    res.json({ booking });
  } catch (e) {
    next(e);
  }
});

// Add a car
router.post('/cars', async (req, res, next) => {
  try {
    const car = await Car.create(clean(req.body));

    res.status(201).json({ car });
  } catch (e) {
    next(e);
  }
});

// Update a car
router.put('/cars/:id', async (req, res, next) => {
  try {
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      clean(req.body),
      { new: true, runValidators: true }
    );

    if (!car) {
      return res.status(404).json({
        message: 'Car not found.'
      });
    }

    res.json({ car });
  } catch (e) {
    next(e);
  }
});

// Delete a car
router.delete('/cars/:id', async (req, res, next) => {
  try {
    const active = await Booking.exists({
      car: req.params.id,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (active) {
      return res.status(409).json({
        message:
          'This car has active bookings. Cancel or complete them before deleting it.'
      });
    }

    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({
        message: 'Car not found.'
      });
    }

    res.json({ message: 'Car deleted.' });
  } catch (e) {
    next(e);
  }
});

export default router;
