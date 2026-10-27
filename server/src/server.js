import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';
import { seedCars } from './seed/cars.js';

const port = Number(process.env.PORT || 5000);
try {
  await connectDB(process.env.MONGODB_URI);
  await seedCars();
  app.listen(port,()=>console.log(`DriveEase API running at http://localhost:${port}`));
} catch(error) {
  console.error(`Startup failed: ${error.message}`);
  process.exit(1);
}
