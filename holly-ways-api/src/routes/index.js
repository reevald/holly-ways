const express = require("express");

const router = express.Router();

// Middleware
const { auth, adminOnly, ownerOnly } = require("../middleware/auth");
const { uploadImage } = require("../middleware/uploadFile");

// Controller
const { 
  login,
  register,
  checkAuth
} = require("../controllers/auth");
const { 
  getAllUsers,
  deleteUser
} = require("../controllers/user");
const {
  getAllFunds,
  getAllFundsById,
  getDetailFund,
  getDetailFundById,
  addFund,
  editFund,
  deleteFund
} = require("../controllers/fund");
const {
  addPayment,
  editPayment
} = require("../controllers/payment");
const { getDetailProfile } = require("../controllers/profile");

// Route User
router.post("/login", login);
router.post("/register", register);
// Check login (handler update/refresh in react frontend)
router.get("/check-auth", auth, checkAuth);

// Route Fund
router.get("/funds", getAllFunds);
router.get("/fund/:fundId", getDetailFund);
router.get("/my-funds", auth, getAllFundsById);
router.get("/my-fund/:fundId", auth, getDetailFundById);
router.post("/fund", auth, uploadImage("thumbnail"), addFund);
// Admin(next fitur ^^) and Owner (check item fund first, then check id user is owner or not)
router.patch("/fund/:fundId", auth, uploadImage("thumbnail", skipUpload=true), editFund);
router.delete("/fund/:fundId", auth, deleteFund);

// Route Donate or Payment
router.post("/fund/:fundId", auth, uploadImage("proofAttachment"), addPayment);
// Only edit status payment (pending/success)
router.patch("/fund/:fundId/:paymentId", auth, editPayment);

// Route (only user owner (must have idUser params))
router.get("/profile/:idUser", auth, ownerOnly, getDetailProfile);
// Route (Admin Only)
router.get("/users", auth, adminOnly, getAllUsers);
router.delete("/user/:id", auth, adminOnly, deleteUser);

module.exports = router;