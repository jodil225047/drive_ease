import Car from '../models/Car.js';
const sampleCars = [
  {name:'Hyundai Creta',brand:'Hyundai',category:'SUV',year:2024,seats:5,transmission:'Automatic',fuelType:'Petrol',pricePerDay:3200,image:'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=1200&q=85',description:'A comfortable SUV for weekend escapes and everyday adventures.'},
  {name:'Honda City',brand:'Honda',category:'Sedan',year:2023,seats:5,transmission:'Automatic',fuelType:'Petrol',pricePerDay:2500,image:'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1200&q=85',description:'A refined sedan with a smooth drive and generous cabin space.'},
  {name:'Mahindra Thar',brand:'Mahindra',category:'SUV',year:2024,seats:4,transmission:'Manual',fuelType:'Diesel',pricePerDay:4200,image:'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=85',description:'Ready for scenic routes, mountain roads and spontaneous plans.'},
  {name:'Maruti Swift',brand:'Maruti Suzuki',category:'Hatchback',year:2024,seats:5,transmission:'Manual',fuelType:'Petrol',pricePerDay:1700,image:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85',description:'Compact, easy to drive and perfect for city exploration.'},
  {name:'Kia Seltos',brand:'Kia',category:'SUV',year:2024,seats:5,transmission:'Automatic',fuelType:'Diesel',pricePerDay:3500,image:'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=85',description:'A stylish all-rounder with room for the whole crew.'},
  {name:'Toyota Innova Hycross',brand:'Toyota',category:'MPV',year:2024,seats:7,transmission:'Automatic',fuelType:'Hybrid',pricePerDay:5000,image:'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1200&q=85',description:'Spacious comfort for family trips and long-distance drives.'}
];
export async function seedCars() {
  const count = await Car.countDocuments();
  if (!count) { await Car.insertMany(sampleCars); console.log('Sample cars added'); }
}
