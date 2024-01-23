// Full-Stack/server/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { MongoClient } = require("mongodb");

// Replace with your MongoDB URI
const Db = process.env.ATLAS_URI;
const client = new MongoClient(Db);

router.post('/register', async (req, res) => {
    try {
        await client.connect();
        const usersCollection = client.db("Cluster0").collection("users");
        
        // Check if user already exists
        const existingUser = await usersCollection.findOne({ username: req.body.username });
        if (existingUser) {
            return res.status(400).send({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Insert new user
        await usersCollection.insertOne({
            username: req.body.username,
            password: hashedPassword
        });

        res.status(201).send({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).send({ message: "Server error" });
    } finally {
        await client.close();
    }
});
    
router.post('/login', async (req, res) => {
    try {
        await client.connect();
        console.log("Connected to DB");
        const usersCollection = client.db("Cluster0").collection("users");
        const user = await usersCollection.findOne({ username: req.body.username });

        // Use bcrypt to compare the hashed password
        if (user && await bcrypt.compare(req.body.password, user.password)) {
            res.send({ message: "Login successful" });
        } else {
            res.status(401).send({ message: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).send({ message: "Server error" });
    } finally {
        await client.close();
    }
});

module.exports = router;
