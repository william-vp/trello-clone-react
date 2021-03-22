const mongoose = require('mongoose');
require('dotenv').config({path: 'var.env'});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log("DB CONECTADA");
    } catch (e) {
        console.log("ERROR CONECTANDO DB");
        console.log(e);
        process.exit(1);
    }
}
module.exports = connectDB;
//secret
//VbuiMDc4pzAD9To44BUzT403v7jeFbz7ajQ1tAJs