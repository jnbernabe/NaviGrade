// routes/adminRoutes.js

// import express from "express";
// import db from "../db/conn.mjs";
// import { ObjectId } from "mongodb";
// import Admin from "../models/Admin.mjs";

const express = require("express");
const { ObjectId } = require("mongodb");
const Admin = require("../models/Admin.js");

const router = express.Router();


// Get all admins
router.get('/', async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific admin
router.get('/:id', async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new admin
router.post('/', async (req, res) => {
  const admin = new Admin({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password, // Remember to hash the password before storing it
  });

  try {
    const newAdmin = await admin.save();
    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an admin
router.patch('/:id', async (req, res) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password, // Remember to hash the password before storing it
        },
      },
      { new: true }
    );
    res.json(updatedAdmin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an admin
router.delete('/:id', async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    res.json(deletedAdmin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
