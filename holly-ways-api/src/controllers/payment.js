const { user, fund, payment } = require("../../models");
const Joi = require("joi");

exports.addPayment = async (req, res) => {
  const { fundId } = req.params;

  const schema = Joi.object({
    donateAmount: Joi.number().min(1).required()
  });

  // status and proofAttachment will inject in below
  const { error } = schema.validate(req.body);

  // if error send validation error message
  if (error) return res.status(400).send({
    error: {
      message: error.details[0].message
    }
  });

  try {
    const newPayment = await payment.create({
      donateAmount: req.body.donateAmount,
      status: "pending",
      proofAttachment: req.files.proofAttachment[0].filename, // only one?
      fundId,
      userId: req.user.id
    });

    if (newPayment) {
      let dataPayment = await payment.findOne({
        where: {
          id: newPayment.id
        },
        attributes: ["id", "donateAmount", "status", "proofAttachment", "fundId"],
        include: [{
          model: user,
          attributes: ["id", "fullName", "email"]
        }]
      });

      dataPayment = JSON.parse(JSON.stringify(dataPayment));
      console.log("New data payment", dataPayment);

      res.status(200).send({
        status: "success",
        data: {
          userDonate: {
            id: dataPayment.id,
            donateAmount: dataPayment.donateAmount,
            status: dataPayment.status,
            proofAttachment: dataPayment.proofAttachment,
            fundId: dataPayment.fundId,
            donator: {
              id: dataPayment.user.id,
              fullName: dataPayment.user.fullName,
              email: dataPayment.user.email
            }
          }
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error"
    })
  }
}

// Only changes status payment (pending/success)
exports.editPayment = async (req, res) => {
  const { fundId, paymentId } = req.params;

  const { status } = req.body;

  if (!status && status !== "pending" && status !== "success") {
    return res.status(400).send({
      status: "failed",
      message: "credential is invalid"
    });
  }

  // Check id fund and id payment, only owner fund can edit
  const checkFund = await fund.findOne({
    where: {
      id: fundId,
      userId: req.user.id
    },
    include: [{
      model: payment,
      where: {
        id: paymentId
      }
    }]
  });

  console.log("Periksa checkfund", checkFund);
  if (!checkFund && !checkFund.payments) res.status(400).send({
    status: "failed",
    message: "credential is invalid"
  });

  try {
    await payment.update(
      { status },
      {
        where: {
          id: paymentId
        }
      }
    );

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