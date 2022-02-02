const { user } = require("../../models");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.checkAuth = async (req, res) => {
  try {
    const dataUser = await user.findOne({
      where: {
        id: req.user.id // get by data in jwt
      },
      attributes: {
        exclude: ["createAt", "updateAt", "password"]
      }
    });

    if (!dataUser) return res.status(400).send({
      status: "failed",
      message: "credential is invalid"
    });

    // Update jwt (maybe jwt will be expire)
    const token = jwt.sign(
      {
        id: dataUser.id,
        email: dataUser.email,
        fullName: dataUser.fullName,
        status: dataUser.status,
        role: dataUser.role
      },
      process.env.TOKEN_KEY
    );

    res.status(200).send({
      status: "success",
      data: {
        user: {
          id: dataUser.id,
          fullName: dataUser.fullName,
          email: dataUser.email,
          token
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error"
    });
  }
}

exports.login = async (req, res) => {
  // our validation schema here
  const schema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(5).required()
  });

  // do validation and get error object from schema.validate
  const { error } = schema.validate(req.body);

  // if error send validation error massage
  if (error) return res.status(400).send({
    error: {
      message: error.details[0].message
    }
  });

  try {
    // Check email first
    const dataUser = await user.findOne({
      where: {
        email: req.body.email.trim()
      },
      attributes: { // ref: https://sequelize.org/master/class/lib/model.js~Model.html#static-method-findAll
        exclude: ["createAt", "updateAt"]
      }
    });

    // if email is not exist
    if (!dataUser) return res.status(400).send({
      status: "failed",
      message: "credential is invalid"
    });

    // compare password between entered from client and from database
    const isValid = await bcrypt.compare(
      req.body.password,
      dataUser.password
    );

    // check if not valid then return response with status 400 (bad request)
    if (!isValid) return res.status(400).send({
      status: "failed",
      message: "credential is invalid"
    });

    // generate token
    const token = jwt.sign(
      {
        id: dataUser.id,
        email: dataUser.email,
        fullName: dataUser.fullName,
        status: dataUser.status,
        role: dataUser.role
      },
      process.env.TOKEN_KEY
    );

    res.status(200).send({
      status: "success",
      data: {
        user: {
          id: dataUser.id,
          fullName: dataUser.fullName,
          email: dataUser.email,
          token
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error"
    });
  }
}

exports.register = async (req, res) => {
  const schema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().min(5).required(),
    fullName: Joi.string().trim().min(4).required()
  });

  const { error } = schema.validate(req.body);

  if (error) return res.status(400).send({
    status: "failed",
    message: error.details[0].message,
  });

  try {
    // check if email already exist in database
    const isUserExist = await user.findOne({
      where: {
        email: req.body.email.trim()
      }
    });

    if (isUserExist) return res.status(400).send({
      status: "failed",
      message: "email already exist"
    });

    // encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const accountRole = "user";

    // https://sequelize.org/master/class/lib/model.js~Model.html#static-method-create
    const newUser = await user.create({
      email: req.body.email.trim(),
      password: hashPassword,
      fullName: req.body.fullName,
      status: "active",
      role: accountRole
    });

    // sign JWT here
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
        status: newUser.status,
        role: newUser.role
      },
      process.env.TOKEN_KEY
    );

    res.status(200).send({
      status: "success",
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
          token
        }
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
}