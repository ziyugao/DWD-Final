const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const config = require('./config');

const PORT = config.PORT;

// ---- Connect to mongodb here ----
// read in mongoose library
const mongoose = require('mongoose');
// read in the URI to our MongoDB Atlas 
const MONGODB_URI = config.MONGODB_URI;
// Use mongoose to connect to our MongoDB Atlas server
mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

// --- connect to your collection ---
const images = require('./models/image');

// Handle data in a nice way
app.use(express.json());

// Set your static server
const publicURL = path.resolve(`${__dirname}/public`);
app.use(express.static(publicURL));

// Set your static html file
app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/views/index.html"))
});

app.get("/list", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/views/list.html"))
});

// ---- ADD YOUR API ENDPOINTS HERE ----
// GET: "api/v1/images"
app.get("/api/v1/images", async (req, res) => {
    try{
        const data = await images.find();
        res.json(data);
    } catch(error){
        console.error(error);
        res.json(error);
    }
});

// POST: "api/v1/images"
app.post("/api/v1/images", async (req, res) => {
    try{
        const newImage = {
            data: req.body.data
        }
        const image = await images.create(newImage);
        res.json(image)
    } catch(error){
        console.error(error);
        res.json(error);
    }
});

// PUT: "api/v1/images:id"
// app.put("/api/v1/images/:id", async (req, res) => {
//     try{
//         res.json({})
//     } catch(error){
//         console.error(error);
//         res.json(error);
//     }
// });

// DELETE: "api/v1/images:id"
app.delete("/api/v1/images/:id", async (req, res) => {
    try{
        if (req.params.id == "*") {
            await images.deleteMany({})
            res.json({"message":"successfully removed all images"});
        } else {
            const deletedDocument = await images.findOneAndDelete(req.params.id);
            res.json({"message":"successfully removed item", "data": JSON.stringify(deletedDocument) });
        }
    } catch(error){
        console.error(error);
        res.json(error);
    }
});

// Start listening
app.listen(PORT, () => {
    console.log(`see the magic: http://localhost:${PORT}`);
})