import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import apiRoutes, { seedInitialData } from './routes/api';
import { isSupabaseConfigured } from './services/supabase';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sahayak';

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Sahayak AI Backend',
    supabaseActive: isSupabaseConfigured(),
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected (in-memory fallback active)',
    timestamp: new Date().toISOString()
  });
});

// Database connection & server start
async function startServer() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 4000
    });
    console.log('Connected to MongoDB successfully!');
    await seedInitialData();
  } catch (err: any) {
    console.warn('MongoDB connection failed. Continuing with Supabase + in-memory fallback:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`Sahayak Backend Server is running on http://localhost:${PORT}`);
  });
}

startServer();
