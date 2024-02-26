// // routes/studentRoutes.js
// import express from "express";
// import { ObjectId } from "mongodb";
// import Student from "../models/Student.js";

const express = require("express");
const ObjectId = require("mongodb").ObjectId;
const Student = require("../models/Student.js");
const dbo = require("../db/conn");
const router = express.Router();

// Get all students
router.get('/', async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    db_connect
   .collection("student")
   .find({})
    .toArray()
    .then((data) => {
      console.log(data);
      res.json(data);
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific student
router.get('/:id', async (req, res) => {
    try {
      let db_connect = dbo.getDb();
      await db_connect
        .collection("student")
        .find({ _id: new ObjectId(req.params.id) })
        .toArray()
        .then((data) => {
          res.json(data);
        });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


// Create a new student
router.post('/', async (req, res) => {
  try {
    const student = new Student({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password, // Remember to hash the password before storing it
      courses: [],
    });
    let db_connect = dbo.getDb();
    await db_connect.collection("student").insertOne(student)
      .then((data) => {
        console.log(data);
        res.json(data);
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a student
router.patch('/:id', async (req, res) => {
  try {
    let db_connect = dbo.getDb();
    await db_connect.collection("student").updateOne(req.params.id, { $set: req.body }, { new: true })
      .then((data) => {
        res.json(data);
      }
      );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a student
router.delete('/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    res.json(deletedStudent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
