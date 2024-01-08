const User = require("../models/UserModel");
const Queue = require("../models/QueueModel");
const { hashPassword, comparePasswords } = require("../utils/hashPassword");
const generateAuthToken = require("../utils/generateAuthToken");
let cookieParams = require("../config/cookieParameter");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password"); //exclude password in query result
    return res.json(users);
  } catch (err) {
    next(err);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { name, lastName, password,phoneNumber,isAdmin,isGRAdmin, productType,isRTVAdmin,adminRole,docType } = req.body;
    let { email } = req.body;
    if (!(name && lastName && email && password)) {
      return res.status(400).send("All inputs are required");
    }
    email = email.toLowerCase(); //change email to lower case
    const userExists = await User.findOne({ email });
    //check if user exists
    if (userExists) {
      return res.status(400).send({ error: "user already existed" });
    } else {
      const hashedPassword = hashPassword(password);
      //create new user
      const user = await User.create({
        name,
        lastName,
        email: email,
        password: hashedPassword,
        phoneNumber,
        isAdmin,
        isGRAdmin,
        productType,
        isRTVAdmin,
        adminRole,
        docType
      });
      res
        .cookie(
          "access_token",
          generateAuthToken(
            user._id,
            user.name,
            user.lastName,
            user.email,
            user.isAdmin,
            user.isGRAdmin,
            user.productType
          ),
          cookieParams
        ) //send cookie to client
        .status(201)
        .json({
          success: "User created",
          userCreated: {
            _id: user._id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin,
            isGRAdmin: user.isGRAdmin
          },
        });
    }
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { password, doNotLogout } = req.body;
    let { email } = req.body;
    if (!(email && password)) {
      return res.status(400).send("All inputs are required");
    }
    email = email.toLowerCase(); //change email to lower case

    const user = await User.findOne({ email }).orFail();
    if(!user){
      return res.status(401).send("wrong credentials");
    }
    if (user && await comparePasswords(password, user.password) === true) {
      if (doNotLogout) {
        cookieParams = { ...cookieParams, maxAge: 1000 * 60 * 60 * 24 * 7 }; // set maxAge to 7 days 
      }else{
        cookieParams = { ...cookieParams, maxAge: 1000 * 60 * 60 * 24}; // set maxAge to 24 hr
      }
      return res
        .cookie(
          "access_token",
          generateAuthToken(
            user._id,
            user.name,
            user.lastName,
            user.email,
            user.isAdmin,
            user.isGRAdmin,
            user.productType,
            user.isRTVAdmin
          ),
          cookieParams
        )
        .json({
          success: "user logged in",
          userLoggedIn: {
            _id: user._id,
            name: user.name,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin,
            isGRAdmin: user.isGRAdmin,
            doNotLogout,
            productType:user.productType,
            isRTVAdmin:user.isRTVAdmin
          },
        });
    } else {
      return res.status(401).send("wrong credentials");
    }
  } catch (err) {
    if(err.message.includes("No document found for query")){
      return res.status(401).send("wrong credentials");
    }
    next(err);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).orFail();
    user.name = req.body.name || user.name;
    user.lastName = req.body.lastName || user.lastName;
    user.phoneNumber = req.body.phoneNumber;
    user.address = req.body.address;
    user.country = req.body.country;
    user.zipCode = req.body.zipCode;
    user.city = req.body.city;
    user.state = req.body.state;

    //check password match on DB
    if (req.body.password !== user.password) {
      user.password = hashPassword(req.body.password);
    }
    await user.save();

    res.json({
      success: "user updated",
      userUpdated: {
        _id: user._id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
        isGRAdmin: user.isGRAdmin,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).orFail();
    return res.send(user);
  } catch (err) {
    next(err);
  }
};



const getUserById = async (req, res, next) => {
  try {
      const user = await User.findById(req.params.id).select("name lastName email isAdmin isGRAdmin").orFail();
      return res.send(user);
  } catch (err) {
     next(err); 
  }
}

const updateUserById = async (req, res, next) => {
  try {
      const user = await User.findById(req.params.id).orFail();   
      user.name = req.body.name || user.name;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      user.isAdmin = req.body.isAdmin;
      user.isGRAdmin = req.body.isGRAdmin;

      await user.save();

      res.send("user updated");

  } catch (err) {
     next(err); 
  }
}

const deleteUserById = async (req, res, next) => {
  try {
     const user = await User.findById(req.params.id).orFail();
     await user.deleteOne(); 
     res.send("user removed");
  } catch (err) {
      next(err);
  }
}

module.exports = {
  getUsers: getUsers,
  registerUser: registerUser,
  loginUser: loginUser,
  updateUserProfile: updateUserProfile,
  getUserProfile: getUserProfile,
  getUserById:getUserById,
  updateUserById:updateUserById,
  deleteUserById:deleteUserById
};
