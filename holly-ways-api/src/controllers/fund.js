const { user, fund, payment } = require("../../models");
const Joi = require("joi");

exports.getAllFundsById = async (req, res) => {
  try {

    const dataAllFunds = await fund.findAll({
      where: { userId: req.user.id },
      attributes: ["id", "title", "thumbnail", "goal", "description"],
      include: [{
        model: payment,
        attributes: ["status", "donateAmount"]
      }]
    });

    if (!dataAllFunds) return res.status(400).send({
      status: "failed",
      message: "credential is invalid"
    });

    console.log("AllFundById", dataAllFunds);

    res.status(200).send({
      status: "success",
      data: {
        funds: dataAllFunds
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

exports.getAllFunds = async (req, res) => {
  try {
    let dataAllFunds = await fund.findAll({
      attributes: ["id", "title", "thumbnail", "goal", "description"],
      include: [{
        model: payment,
        attributes: ["id", "donateAmount", "status", "proofAttachment"],
        include: [{
          model: user,
          attributes: ["fullName", "email"]
        }]
      }]
    });

    // Rekontruksi data
    dataAllFunds = dataAllFunds.map(dataFund => {
      return {
        id: dataFund.id,
        title: dataFund.title,
        thumbnail: dataFund.thumbnail,
        goal: dataFund.goal,
        description: dataFund.description,
        usersDonate: dataFund.payments.map(payment => {
          return {
            id: payment.id,
            fullName: payment.user.fullName,
            email: payment.user.email,
            donateAmount: payment.donateAmount,
            status: payment.status,
            proofAttachment: payment.proofAttachment
          }
        })
      }
    });
    
    res.status(200).send({
      status: "success",
      data: {
        funds: dataAllFunds
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

exports.getDetailFundById = async (req, res) => {
  const { fundId } = req.params;
  try {
    const dataFund = await fund.findOne({
      where: { id: fundId, userId: req.user.id },
      attributes: ["id", "title", "thumbnail", "goal", "description", "createdAt"],
      include: [{
        model: payment,
        attributes: ["id", "donateAmount", "status", "proofAttachment", "createdAt"],
        include: [{
          model: user,
          attributes: ["id", "fullName", "email"]
        }]
      }]
    });

    if (!dataFund) return res.status(400).send({
      status: "failed",
      message: "credential is invalid"
    });

    res.status(200).send({
      status: "success",
      data: {
        fund: {
          id: dataFund.id,
          title: dataFund.title,
          thumbnail: dataFund.thumbnail,
          goal: dataFund.goal,
          description: dataFund.description,
          createdAt: dataFund.createdAt,
          usersDonate: dataFund.payments.map(payment => {
            return {
              id: payment.id,
              idUser: payment.user.id,
              fullName: payment.user.fullName,
              email: payment.user.email,
              donateAmount: payment.donateAmount,
              status: payment.status,
              proofAttachment: payment.proofAttachment,
              createdAt: payment.createdAt
            }
          })
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

exports.getDetailFund = async (req, res) => {
  const { fundId } = req.params;
  try {
    const dataFund = await fund.findOne({
      where: { id: fundId },
      attributes: ["id", "title", "thumbnail", "goal", "description", "createdAt"],
      include: [{
        model: payment,
        attributes: ["id", "donateAmount", "status", "proofAttachment", "createdAt"],
        include: [{
          model: user,
          attributes: ["id", "fullName", "email"]
        }]
      }]
    });

    if (!dataFund) return res.status(400).send({
      status: "failed",
      message: "credential is invalid"
    });

    res.status(200).send({
      status: "success",
      data: {
        fund: {
          id: dataFund.id,
          title: dataFund.title,
          thumbnail: dataFund.thumbnail,
          goal: dataFund.goal,
          description: dataFund.description,
          createdAt: dataFund.createdAt,
          usersDonate: dataFund.payments.map(payment => {
            return {
              id: payment.id,
              idUser: payment.user.id,
              fullName: payment.user.fullName,
              email: payment.user.email,
              donateAmount: payment.donateAmount,
              status: payment.status,
              proofAttachment: payment.proofAttachment,
              createdAt: payment.createdAt
            }
          })
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

exports.addFund = async (req, res) => {
  // our validation
  const schema = Joi.object({
    title: Joi.string().trim().min(5).required(),
    goal: Joi.number().min(1).required(),
    description: Joi.string().trim().min(5).required()
  });

  // do validation
  const { error } = schema.validate(req.body);

  // if error send validation error message
  if (error) return res.status(400).send({
    status: "failed",
    message: error.details[0].message,
  });

  try {
    console.log("Ctrl addfund : Iam here!");
    const creatorId = req.user.id;
    // Remember: create = save + build (by docs)
    const newFund = await fund.create({
      title: req.body.title.trim(),
      thumbnail: req.files.thumbnail[0].filename, // only one thumbnail 
      goal: req.body.goal,
      description: req.body.description.trim(),
      userId: creatorId
    });

    if (newFund) {
      let dataFund = await fund.findOne({
        where: {
          id: newFund.id
        },
        attributes: ["id", "title", "thumbnail", "goal", "description"],
        include: [{
          model: payment,
          attributes: ["id", "donateAmount", "status", "proofAttachment"],
          include: [{
            model: user,
            attributes: ["fullName", "email"]
          }]
        }]
      });
      
      dataFund = JSON.parse(JSON.stringify(dataFund));
      console.log("New data fund", dataFund);

      res.status(200).send({
        status: "success",
        data: {
          fund: {
            id: dataFund.id,
            title: dataFund.title,
            thumbnail: dataFund.thumbnail,
            goal: dataFund.goal,
            description: dataFund.description,
            usersDonate: dataFund.payments
          }
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
}

exports.editFund = async (req, res) => {
  const { fundId } = req.params;
  // console.log("req body", Object.keys(req.body).length);
  // console.log("req files", req.files);

  if (!req.files && Object.keys(req.body).length === 0) return res.status(400).send({
    status: "failed",
    message: "credential is invalid"
  });

  // First Check id Fund and id User (only creator can edit)
  const checkFund = await fund.findOne({
    where: {
      id: fundId,
      userId: req.user.id
    }
  });

  if (!checkFund) return res.status(400).send({
    status: "failed",
    message: "credential is invalid"
  });
  
  let fields = req.body;
  if (Object.keys(req.files).length !== 0) {
    fields.thumbnail = req.files.thumbnail[0].filename
  }
  console.log("Fields", fields);

  // our validation
  const schema = Joi.object({
    title: Joi.string().min(5),
    goal: Joi.number().min(1),
    description: Joi.string().min(5),
    thumbnail: Joi.string()
  });

  // do validation
  const { error } = schema.validate(fields);

  if (error) return res.status(400).send({
    error: {
      message: error.details[0].message
    }
  });

  // do update data fund
  try {
    await fund.update(
      fields,
      {
        where: {
          id: fundId
        }
      }
    )

    // Check with get data
    const dataFund = await fund.findOne({
      where: { id: fundId },
      attributes: ["id", "title", "thumbnail", "goal", "description"],
      include: [{
        model: payment,
        attributes: ["id", "donateAmount", "status", "proofAttachment"],
        include: [{
          model: user,
          attributes: ["fullName", "email"]
        }]
      }]
    });

    if (!dataFund) return res.status(400).send({
      status: "failed",
      message: "credential is invalid"
    });

    res.status(200).send({
      status: "success",
      data: {
        fund: {
          id: dataFund.id,
          title: dataFund.title,
          thumbnail: dataFund.thumbnail,
          goal: dataFund.goal,
          description: dataFund.description,
          usersDonate: dataFund.payments.map(payment => {
            return {
              id: payment.id,
              fullName: payment.user.fullName,
              email: payment.user.email,
              donateAmount: payment.donateAmount,
              status: payment.status,
              proofAttachment: payment.proofAttachment
            }
          })
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

exports.deleteFund = async (req, res) => {
  const { fundId } = req.params;

  // First Check id Fund and id User (only creator can delete)
  const checkFund = await fund.findOne({
    where: {
      id: fundId,
      userId: req.user.id
    }
  });

  if (!checkFund) return res.status(400).send({
    status: "failed",
    message: "credential is invalid"
  });

  await fund.destroy({
    where: {
      id: fundId
    }
  });

  res.status(200).send({
    status: "success",
    data: {
      id: fundId
    }
  });
}