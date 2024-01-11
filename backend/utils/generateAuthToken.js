const jwt = require("jsonwebtoken");

const generateAuthToken = (_id, name, lastName, email, isAdmin,isGRAdmin,productType,isRTVAdmin) => {
  return jwt.sign(
    { _id, name, lastName, email, isAdmin,isGRAdmin,productType,isRTVAdmin },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "15h" }//set expired token date
  );
};
module.exports = generateAuthToken
