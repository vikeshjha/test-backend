const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS configuration
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://test-frontend-self-three.vercel.app'
    ],
    credentials: true
}));

app.use(express.json());

// Define User schema inline
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// MongoDB connection with error handling
const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGO_URI);
            console.log('✅ MongoDB connected successfully');
        }
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        throw err;
    }
};

// Test route
app.get('/', async (req, res) => {
    try {
        await connectDB();
        res.json({ 
            message: 'Backend is running!',
            timestamp: new Date().toISOString(),
            mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
        });
    } catch (err) {
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// Signup endpoint
app.post('/api/signup', async(req, res) => {
    try {
        await connectDB();
        
        console.log('📝 Received signup request:', req.body);
        
        const { name, password } = req.body;
        
        if (!name || !password) {
            return res.status(400).json({ error: 'Name and password are required' });
        }
        
        const newUser = new User({ name, password });
        await newUser.save();
        
        console.log('✅ User created successfully:', { name });
        res.status(201).json({ message: "User created successfully!" });
        
    } catch(err) {
        console.error('❌ Error creating user:', err);
        res.status(500).json({ error: `Server error: ${err.message}` });
    }
});

// Handle undefined routes
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

module.exports = app;
