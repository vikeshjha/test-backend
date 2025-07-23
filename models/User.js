const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true
    },
    password: { 
        type: String, 
        required: true
    }
}, {
    timestamps: true // This adds createdAt and updatedAt fields
});

module.exports = mongoose.model('User', userSchema);
