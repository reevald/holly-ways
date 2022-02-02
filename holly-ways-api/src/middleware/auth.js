const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  
  const authHeader = req.header("Authorization");
  // Extract authHeader = "Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1];

  // Avoid error in console browser with remove status (401) => (200)
  if (!token || token === "undefined") return res.status(401).send({
    status: "failed",
    message: "Unauthorized"
  });

  try {
    const dataUserVerified = jwt.verify(token, process.env.TOKEN_KEY);
    req.user = dataUserVerified;
    console.log("Ctrl auth : Iam here!", req.user);
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send({
      status: "failed",
      message: "invalid token"
    });
  }
}

exports.adminOnly = (req, res, next) => {
  if (req.user.role && req.user.role === "admin") {
    return next();
  }
  res.status(403).send({ message: "Forbidden" });
}

exports.ownerOnly = (req, res, next) => {
  // must have params idUser
  const { idUser } = req.params;
  try {
    if (parseInt(idUser) === req.user.id) {
      next();
    } else {
      res.status(403).send({ message: "Forbidden" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      status: "failed",
      message: "Unauthorized"
    });
  }
}