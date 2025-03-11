const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

async function verifyAuth(req, res, next) {
  const { authorization } = req.headers;   //authorization = 'Bearer token'
  // console.log("authorization: ", authorization);
  if(!authorization)
    return res.status(401).json({ error: "Authorization token required" });

  const parts = authorization.split(' ');   //['Bearer', 'token']

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: "Invalid authorization format" });
  }

  const token = parts[1];
  // console.log("token", token);

  if (!token || token === 'null' || token.trim() === '') {
    return res.status(401).json({ error: "Invalid token" });
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: 'Request Unauthorized' })
  }

}

module.exports = verifyAuth;