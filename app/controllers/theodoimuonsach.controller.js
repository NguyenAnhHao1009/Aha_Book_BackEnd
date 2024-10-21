const { query } = require("express");
const BorrowedBookTracking = require("../services/theodoimuonsach.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
  if (!req.body?.madocgia || !req.body?.masach || !req.body?.ngaymuon) {
    return next(
      new ApiError(
        400,
        "Thiếu thông tin cần thiết (mã sách, mã độc giả, ngày mượn)"
      )
    );
  }
  try {
    const borrowedBookTrackingService = new BorrowedBookTracking(
      MongoDB.client
    );
    const document = await borrowedBookTrackingService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi thêm mới 1 lượt mượn sách"));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const borrowedBookTrackingService = new BorrowedBookTracking(
      MongoDB.client
    );
    const { readerName, bookName } = req.query;
    if (readerName) {
      documents = await borrowedBookTrackingService.findByReader(readerName);
    } else if (bookName) {
    } else {
      documents = await borrowedBookTrackingService.find({});
    }
    return res.send(documents);
  } catch (error) {
    return next(
      new ApiError(500, "Có lỗi khi truy cập nhiều quản lý mượn sách")
    );
  }
};

exports.findOne = async (req, res, next) => {
  if (!req.query?.madocgia || !req.query?.masach || !req.query?.ngaymuon) {
    return next(
      new ApiError(400, "Thieu thong tin cua (madocgia, masach, ngaymuon)")
    );
  }
  try {
    const borrowedBookTrackingService = new BorrowedBookTracking(
      MongoDB.client
    );
    const { madocgia, masach, ngaymuon } = req.query;
    const document = await borrowedBookTrackingService.findOne(
      madocgia,
      masach,
      ngaymuon
    );
    if (!document) {
      return next(new ApiError(400, "Không tìm thấy"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi tìm kiếm 1 quản lý mượn"));
  }
};

exports.delete = (req, res) => {
  res.send({ message: "Xoa mot theo doi muon sach" });
};

exports.deleteAll = (req, res) => {
  res.send({ message: "Xoa tat ca theo doi muon sach" });
};

exports.update = async (req, res, next) => {
  if (!req.query?.madocgia || !req.query?.masach || !req.query?.ngaymuon) {
    return next(
      new ApiError(
        400,
        "Thiếu thông tin cần thiết (mã sách, mã độc giả, ngày mượn)"
      )
    );
  }
  try {
    const borrowedBookTrackingService = new BorrowedBookTracking(
      MongoDB.client
    );
    const document = await borrowedBookTrackingService.update(
      req.query,
      req.body
    );
    if (!document) {
      return next(new ApiError(400, "Không tìm thấy lượt mượn phù hợp"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi cập nhật 1 lượt mượn sách"));
  }
};
