const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
require('dotenv').config();

const app = express();

// CORS configuration - make sure your frontend domain is included
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://test-frontend-self-three.vercel.app',
        // Add any other domains you might be testing from
        'https://vercel.app'
    ],
    credentials: true
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Backend is running!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Signup endpoint
app.post('/api/signup', async(req, res) => {
    console.log('📝 Received signup request:', req.body);
    
    try {
        const { name, password } = req.body;
        
        // Basic validation
        if (!name || !password) {
            return res.status(400).json({ error: 'Name and password are required' });
        }
        
        const newUser = new User({ name, password });
        await newUser.save();
        
        console.log('✅ User created successfully:', { name });
        res.status(201).json({ message: "User created successfully!" });
        
    } catch(err) {
        console.error('❌ Error creating user:', err);
        res.status(500).json({ error: 'Server error while creating user' });
    }
});

// Handle undefined routes
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Export for Vercel
module.exports = app;
