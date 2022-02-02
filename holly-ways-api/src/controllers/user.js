const { user } = require("../../models");

exports.getAllUsers = async (req, res) => {
  try {
    const dataAllUsers = await user.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "password", "status", "role"]
      }
    });

    res.status(200).send({
      status: "success",
      data: {
        users: dataAllUsers
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

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check user exist
    const dataUser = await user.findOne({
      where: { id }
    });

    if (!dataUser) return res.status(400).send({
      status: "failed",
      message: "credential is invalid"
    });

    await user.destroy({
      where: { id }
    });

    res.status(200).send({
      status: "success",
      data: {
        id: dataUser.id
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