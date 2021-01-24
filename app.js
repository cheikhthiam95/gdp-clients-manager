const express = require('express');
const cors = require("cors");
const auth = require("./middlewares/auth");
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const connectDb = require("./config/db");
const mongoose = require("mongoose");
const { json } = require('body-parser');
const API_PREFIX = 'api'
const app = express();

connectDb();
mongoose.set("toJSON", { virtuals: true });

app.use(cors());
app.use(json());

app.use(`/${API_PREFIX}/users`, usersRouter);
app.use(auth);

// Routes which need Authentification
app.use(`/${API_PREFIX}`, indexRouter);


app.use((err, req, res, next) => {
    if(err) {
        if(!err.isHandled) console.log("Error Unhandled from App 'Error Middleware'",err);
        const errObj = {
            message:err.message || err,
            status: err.status || 500
        }
        res.status(errObj.status).send(errObj);
    }
});

module.exports = app;