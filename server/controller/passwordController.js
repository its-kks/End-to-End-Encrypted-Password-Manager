const Password=require('../models/passwordModel')
const asyncHandler = require('express-async-handler');
const CryptoJS = require('crypto-js');

//@desc Get all passwords
//@route GET /api/passwords
//@access private
const getPasswords = asyncHandler(async (req, res) => {
    // Get all encrypted passwords for the current user
    const passwords = await Password.find({ user_id: req.user.id });

    res.status(200).json(passwords);
});

//@desc create password
//@route POST /api/passwords/id
//@access private
const createPassword = asyncHandler(async (req, res) => {
    const { username, website, password } = req.body;
    if (!username || !password) {
      res.status(400);
      throw new Error('Username and password are mandatory fields');
    }
  
    try {
      const userPassword = await Password.create({
        username,
        website,
        password,
        user_id: req.user.id,
      });
      res.status(201).json(userPassword);
    } catch (error) {
        console.log(error);
      res.status(500);
      throw new Error('Error in creating password');
    }
});

//@desc get single password
//@route GET /api/passwords/id
//@access private
const getPassword = asyncHandler(async (req,res)=>{
    const password = await Password.findById(req.params.id);
    if(!password){
        res.status(404);
        throw new Error("Password not found");
    }
    res.status(200).json(password);
})

//@desc delete single password
//@route DELETE /api/passwords/id
//@access private
const deletePassword = asyncHandler(async (req,res)=>{

    const password = await Password.findById(req.params.id);
    if(!password){
        res.status(404);
        throw new Error("Password not found");
    }

    if(password.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("No password found");
    }

    await Password.deleteOne({_id:req.params.id});
    res.status(200).json(password);
})

//@desc update single password
//@route PUT /api/passwords/id
//@access private
const updatePassword = asyncHandler(async (req, res) => {
  // Check if password is present
  const data = await Password.findById(req.params.id);
  if (!data) {
    res.status(404);
    throw new Error("Credentials not found");
  }

  // Check if the password belongs to the current user
  if (data.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("Password not found");
  }

  const { username, website, password } = req.body;

  const updatedPassword = {
    username,
    website,
    password
  };

  try {
    const updatedPasswordRecord = await Password.findByIdAndUpdate(
      req.params.id,
      updatedPassword,
      { new: true }
    );

    res.status(200).json(updatedPasswordRecord);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Error in updating password");
  }
});

module.exports={getPasswords,createPassword,getPassword,updatePassword,deletePassword};

