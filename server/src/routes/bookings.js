import { Router } from 'express';
import Booking from '../models/Booking.js';
import Car from '../models/Car.js';
import { protect } from '../middleware/auth.js';
const router = Router();
const DAY = 24 * 60 * 60 * 1000;
function dayStart(value) {
  const s = String(value || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(`${s}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) || d.toISOString().slice(0,10)!==s ? null : d;
}
router.post('/', protect, async (req,res,next) => {
  try {
    const {carId} = req.body;
    const pickupDate = dayStart(req.body.pickupDate), returnDate = dayStart(req.body.returnDate);
    if (!pickupDate || !returnDate) return res.status(400).json({message:'Choose valid pickup and return dates.'});
    const today = new Date(); today.setUTCHours(0,0,0,0);
    if (pickupDate < today) return res.status(400).json({message:'Pickup date cannot be in the past.'});
    if (returnDate <= pickupDate) return res.status(400).json({message:'Return date must be after pickup date.'});
    const days = Math.ceil((returnDate-pickupDate)/DAY);
    if (days > 60) return res.status(400).json({message:'Bookings can be up to 60 days long.'});
    const car = await Car.findById(carId);
    if (!car || !car.available) return res.status(404).json({message:'This car is not available.'});
    const overlap = await Booking.exists({
      car: car._id, status: {$in:['pending','confirmed']},
      pickupDate: {$lt:returnDate}, returnDate: {$gt:pickupDate}
    });
    if (overlap) return res.status(409).json({message:'This car already has a booking that overlaps those dates. Please choose different dates.'});
    const booking = await Booking.create({user:req.user._id,car:car._id,pickupDate,returnDate,days,pricePerDay:car.pricePerDay,totalPrice:car.pricePerDay*days});
    const populated = await Booking.findById(booking._id).populate('car','name image category').populate('user','name email');
    res.status(201).json({booking:populated});
  } catch(e) { next(e); }
});
router.get('/mine', protect, async (req,res,next) => {
  try { const bookings = await Booking.find({user:req.user._id}).populate('car','name image category pricePerDay').sort({createdAt:-1}); res.json({bookings}); }
  catch(e) { next(e); }
});
router.patch('/:id/cancel', protect, async (req,res,next) => {
  try {
    const booking = await Booking.findOne({_id:req.params.id,user:req.user._id});
    if(!booking)return res.status(404).json({message:'Booking not found.'});
    if(!['pending','confirmed'].includes(booking.status))return res.status(400).json({message:'This booking can no longer be cancelled.'});
    booking.status='cancelled'; await booking.save(); res.json({booking});
  } catch(e) { next(e); }
});
export default router;
