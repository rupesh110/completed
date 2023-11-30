// db.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const uri = process.env.MONGO_URI;
mongoose.connect(uri);

const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to the database');
});

// Event listener for the error event
db.on('error', (error) => {
  console.error('Error connecting to the database:', error);
});

export default db;
