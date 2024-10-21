const express = require("express");
const trackBookBorrowing = require("../controllers/theodoimuonsach.controller");

const router = express.Router();

router
  .route("/")
  .get(trackBookBorrowing.findAll)
  .post(trackBookBorrowing.create);

router.route("/update").post(trackBookBorrowing.update);

router.route("/detail").get(trackBookBorrowing.findOne);
module.exports = router;
