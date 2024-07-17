const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const Student = require('./models/Student');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB with IPv4 address and increased timeout
mongoose.connect('mongodb://127.0.0.1:27017/studentsdb', {
    serverSelectionTimeoutMS: 30000 // 30 seconds
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });

// Routes
app.post('/add_student', async (req, res) => {
    const { name, age, state, rank } = req.body;
    try {
        const student = new Student({ name, age, state, rank });
        await student.save();
        res.json({ message: 'Student added successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding student', error: error.message });
    }
});

app.get('/predict_result', async (req, res) => {
    try {
        const students = await Student.find().sort({ rank: 1 });
        const results = students.map(student => {
            let college;
            if (student.rank <= 500) {
                college = 'College Alloted: IIT BHU';
            } else if (student.rank <= 1000) {
                college = 'College Alloted: HBTU KANPUR';
            } else if (student.rank <= 2000) {
                college = 'College Alloted: MNNIT ALLAHABAD';
            } 
            else if (student.rank <= 4000) {
                college = 'College Alloted: MMMUT GORAKHPUR';
            }
            else if (student.rank <= 5500) {
                college = 'College Alloted: IET LUCKNOW';
            } else {
                college = 'BEST OF LUCK FOR PRIVATE COLLEGES';
            }
            return {
                name : student.name,
                age: student.age,
                state: student.state,
                rank: student.rank,
                college: college
            };
        });
        res.json(results);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching results', error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
