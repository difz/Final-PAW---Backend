const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
dotenv.config();

//MONGO DB CONNECTION
if (!process.env.MONGO_URI) {
    throw Error("Database connection string not found");
}
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Succesfully connected to MongoDB");
    }).catch((err) => {
        console.log("Failed to connect to MongoDB");
        console.log(err);
    });

//Localhost

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
