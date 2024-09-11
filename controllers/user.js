const User = require("../models/users");
const bcrypt = require("bcrypt");
const util = require("util");
const jwt = require("jsonwebtoken");
const jwtSign = util.promisify(jwt.sign);
const CustomError = require('../utils/customError');

exports.signup = async (req, res, next) => {
    const { name, email, password } = req.body; 

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new CustomError("Email is already used.", 409));
        }


        const user = new User({ name, email, password ,image:req.user});
        await user.save();

        res.status(201).send({ message: "User created", user });
    } catch (error) {
        next(new CustomError("Internal server error.", 500));
    }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  
  try {
      const user = await User.findOne({ email });
      if (!user) {
          return next(new CustomError('Invalid email or password', 401));
      }
      const isMatched = await bcrypt.compare(password, user.password);
      if (isMatched) {
          const token = await jwtSign({ userId: user._id }, process.env.JWT_SECRET_ACCESS_TOKEN, {
              expiresIn: '30d',
          });
        
          res.status(200).send({ message: 'User logged in', token ,user});
      } else {
          return next(new CustomError('Invalid email or password', 401));
      }
  } catch (error) {
      next(new CustomError('Internal server error', 500));
  }
};

// exports.refreshToken=async (req, res) => {
//     const { token } = req.body;
//     if (!token) return next(new CustomError('No token provided ', 401));
    
//     jwt.verify(token, process.env.JWT_SECRET_REFRESH_TOKEN, (err, user) => {
//         if (err) return next(new CustomError('Invalid or expired refresh token ', 403));
        
//         const newAccessToken = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET_ACCESS_TOKEN, { expiresIn: '15m' });
//         res.status(200).send({
//             massage:"New access token has been issued successfully.",
//              accessToken: newAccessToken 
//             });
//     })
// }