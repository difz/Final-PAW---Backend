const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    authentication: {
        password: {
            type: String,
            required: true,
            select : false
        },
        token: {
            type: String,
            required: true
        },
        salt: {
            type: String,
            select : false
        },
        seesionToken :{
            type: String,
            select : false
        },   
    },
});

