const express = require("express");
const staffs = require("../controllers/nhanvien.controller");

const router = express.Router();

router
  .route("/")
  .get(staffs.findAll)
  .post(staffs.create)
  .delete(staffs.deleteAll);

router
  .route("/:id")
  .get(staffs.findOne)
  .post(staffs.update)
  .delete(staffs.delete);

module.exports = router;
