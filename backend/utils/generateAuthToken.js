const jwt = require("jsonwebtoken");

const generateAuthToken = (_id, name, lastName, email, isAdmin,isGRAdmin,productType) => {
  return jwt.sign(
    { _id, name, lastName, email, isAdmin,isGRAdmin,productType },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "24h" }//set expired token date
  );
};
module.exports = generateAuthToken
