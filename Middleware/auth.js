const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  try {
    const {access_token} = req.cookies;
    if(!access_token) return res.status(401).json({
        errorMessage:"Unauthirized"
    })

    const verifiedToken = jwt.verify(access_token, process.env.JWT_SECRET)
    req.users = verifiedToken.users;

    next()
    
  } catch (error) {
    console.log(error)
    res.status(401).json({errorMessage:"Unauthized"})
  }
}

module.exports = auth;