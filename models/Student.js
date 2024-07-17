const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: String,
    age: Number,
    state: String,
    rank: Number
});

module.exports = mongoose.model('Student', studentSchema);
