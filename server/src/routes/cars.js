import { Router } from 'express';
import Car from '../models/Car.js';
import Booking from '../models/Booking.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = Router();
const fields = ['name','brand','category','year','seats','transmission','fuelType','pricePerDay','image','description','available'];
function clean(body) {
  const out = {};
  for (const key of fields) if (body[key] !== undefined) out[key] = body[key];
  if (out.image && !/^https?:\/\//i.test(out.image)) throw Object.assign(new Error('Image must be an http or https URL.'), {status:400});
  return out;
}
router.get('/', async (req,res,next) => {
  try {
    const filter = { available: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.transmission) filter.transmission = req.query.transmission;
    if (req.query.search) filter.$or = [{name:{$regex:String(req.query.search).slice(0,50),$options:'i'}},{brand:{$regex:String(req.query.search).slice(0,50),$options:'i'}}];
    const cars = await Car.find(filter).sort({createdAt:-1}).limit(100);
    res.json({cars});
  } catch(e) { next(e); }
});
router.get('/:id', async (req,res,next) => {
  try { const car = await Car.findById(req.params.id); if(!car)return res.status(404).json({message:'Car not found.'}); res.json({car}); }
  catch(e) { next(e); }
});
router.post('/', protect, adminOnly, async (req,res,next) => {
  try { const car = await Car.create(clean(req.body)); res.status(201).json({car}); }
  catch(e) { next(e); }
});
router.put('/:id', protect, adminOnly, async (req,res,next) => {
  try { const car = await Car.findByIdAndUpdate(req.params.id,clean(req.body),{new:true,runValidators:true}); if(!car)return res.status(404).json({message:'Car not found.'}); res.json({car}); }
  catch(e) { next(e); }
});
router.delete('/:id', protect, adminOnly, async (req,res,next) => {
  try {
    const active = await Booking.exists({car:req.params.id,status:{$in:['pending','confirmed']}});
    if(active)return res.status(409).json({message:'This car has active bookings. Cancel or complete them before deleting it.'});
    const car = await Car.findByIdAndDelete(req.params.id); if(!car)return res.status(404).json({message:'Car not found.'});
    res.json({message:'Car deleted.'});
  } catch(e) { next(e); }
});
export default router;
