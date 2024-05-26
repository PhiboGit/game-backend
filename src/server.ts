import connectDB from './db';
import app from './app/app';
import dotenv from 'dotenv';

dotenv.config();

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});