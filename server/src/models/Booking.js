import mongoose from 'mongoose';
const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  pickupDate: { type: Date, required: true },
  returnDate: { type: Date, required: true },
  days: { type: Number, required: true, min: 1 },
  pricePerDay: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ['pending','confirmed','cancelled','completed'], default: 'pending' }
}, { timestamps: true });
bookingSchema.index({ car: 1, pickupDate: 1, returnDate: 1, status: 1 });
export default mongoose.model('Booking', bookingSchema);
