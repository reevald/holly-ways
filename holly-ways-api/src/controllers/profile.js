const { user, fund, payment } = require("../../models");

exports.getDetailProfile = async (req, res) => {
  try {
    const { idUser } = req.params;
    
    // get data user and donate
    const dataUser = await user.findOne({
      where: { id: idUser, status: "active" },
      attributes: ["id", "email", "fullName", "status", "role"],
      include: [{
        model: payment,
        where: { userId: idUser },
        attributes: ["id", "donateAmount", "status", "createdAt"],
        include: [{
          model: fund,
          attributes: ["id", "title"]
        }]
      }]
    });

    if (!dataUser) return res.status(400).send({
      status: "failed",
      message: "credential is invalid"
    });

    res.status(200).send({
      status: "success",
      data: {
        user: {
          id: dataUser.id,
          email: dataUser.email,
          fullName: dataUser.fullName,
          status: dataUser.status,
          role: dataUser.role
        },
        historyDonations: dataUser.payments.map(payment => {
          return {
            idPayment: payment.id,
            idFund: payment.fund.id,
            titleFund: payment.fund.title,
            donateAmount: payment.donateAmount,
            status: (payment.status === "success") ? "Finished" : "Pending",
            createdAt: payment.createdAt
          }
        })
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