import mongoose from 'mongoose';
const carSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  brand: { type: String, default: '', trim: true },
  category: { type: String, enum: ['SUV','Sedan','Hatchback','MPV','Luxury'], default: 'SUV' },
  year: { type: Number, required: true, min: 1990, max: 2035 },
  seats: { type: Number, required: true, min: 1, max: 20 },
  transmission: { type: String, enum: ['Automatic','Manual'], default: 'Automatic' },
  fuelType: { type: String, enum: ['Petrol','Diesel','Electric','Hybrid','CNG'], default: 'Petrol' },
  pricePerDay: { type: Number, required: true, min: 1 },
  image: { type: String, required: true },
  description: { type: String, default: '', maxlength: 1000 },
  available: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model('Car', carSchema);
