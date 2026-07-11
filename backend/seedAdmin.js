const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("./models/User");

async function seedAdmin() {

    await mongoose.connect(process.env.MONGO_URI);

    const adminExists = await User.findOne({
        email: "admin@gmail.com"
    });

    if(adminExists){
        console.log("Admin already exists");
        process.exit();
    }

    const hashedPassword = await bcrypt.hash("Admin@123",10);

    await User.create({
        name:"Admin",
        email:"admin@gmail.com",
        password:hashedPassword,
        role:"ADMIN"
    });

    console.log("Admin Created");

    process.exit();
}

seedAdmin();