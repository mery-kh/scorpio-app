const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const route = require('./router');
const cors = require('cors');
const PORT = process.env.PORT || 4000;
const bodyParser = require('body-parser')
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
global.__homedir = __dirname
route(app)

const start = async () => {
    try {
        await mongoose.connect(`mongodb://localhost/${process.env.DB}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}
start();