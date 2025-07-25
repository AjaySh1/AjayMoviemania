require('dotenv').config();
const mongoose = require("mongoose");

console.log("Loaded MONGODB_URI:", process.env.MONGODB_URI); // Debug log

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log(`connection successful`);
}).catch((e) => {
    console.error(`no connection`, e);
});
