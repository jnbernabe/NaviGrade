// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cookieparser = require("cookie-parser");
const { authenticateToken } = require("./middleware/authMiddleware");
const Student = require("./models/Student");
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
// Middleware
app.use(bodyParser.json());
app.use(cookieparser());

mongoose.connect(process.env.ATLAS_URI);

// Use authenticateToken middleware for protected routes
app.use("/students", authenticateToken, studentRoutes);
app.use("/courses", authenticateToken, courseRoutes);
app.use("/assignments", authenticateToken, assignmentRoutes);
app.use("/admin", adminRoutes);
app.use("/users", userRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).send("Uh oh! An unexpected error occurred.");
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}/`);
});


app.get("/userinfo", authenticateToken, (req, res) => {
  try{
    const user = req.user;
    res.json({ user });

  }catch(error){
    res.status(500).json({ message: error.message });
  }
 
});

// // server.js
// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
// const { authenticateToken } = require('./middleware/authMiddleware');
// const Admin = require('./models/Admin');
// const User = require('./models/User');
// const studentRoutes = require('./routes/studentRoutes');
// const courseRoutes = require('./routes/courseRoutes');
// const assignmentRoutes = require('./routes/assignmentRoutes');
// const adminRoutes = require('./routes/adminRoutes');

// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());

// mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// // Registration endpoint with logging
// app.post('/register', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Username already exists' });
//     }

//     const newUser = new User({ username, password });
//     await newUser.save();

//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Login endpoint with logging
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await User.findOne({ username });
//     if (!user || user.password !== password) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     console.log('Received token in login endpoint:', token);

//     res.json({ token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// // Signup endpoint with logging
// app.post('/admin/signup', async (req, res) => {
//   console.log('Received signup request:', req.body);

//   try {
//     const { email, password, firstName, lastName } = req.body;

//     // Check if the admin with the provided email already exists
//     const existingAdmin = await Admin.findOne({ email });

//     if (existingAdmin) {
//       return res.status(400).json({ message: 'Admin with this email already exists' });
//     }

//     // Hash the password before saving it to the database
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create a new admin
//     const newAdmin = new Admin({
//       email,
//       password: hashedPassword,
//       firstName,
//       lastName,
//     });

//     // Save the new admin to the database
//     await newAdmin.save();

//     console.log('Admin signed up successfully');
//     res.status(201).json({ message: 'Admin signed up successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// app.use('/students', authenticateToken, studentRoutes);
// app.use('/courses', authenticateToken, courseRoutes);
// app.use('/assignments', authenticateToken, assignmentRoutes);

// app.use('/admin', authenticateToken, adminRoutes);

// app.use((err, _req, res, _next) => {
//   console.error(err);
//   res.status(500).send('Uh oh! An unexpected error occurred.');
// });

// const PORT = process.env.PORT || 5050;
// app.listen(PORT, () => {
//   console.log(`Server is running on port: http://localhost:${PORT}/`);
// });
