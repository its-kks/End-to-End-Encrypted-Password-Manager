const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email:{
        type:String,
        require: [true,"Email is compulsory!"],
        unique:[true,"Email already registered!"],
    },
    password:{
        type:String,
        require: [true,"Password is compulsory!"],
    },
    salt:{
        type:String,
        require: [true,"Salt is compulsory!"],
    },
},
    {
        timestamps:true
    }
);

module.exports = mongoose.model("Password_User",userSchema);