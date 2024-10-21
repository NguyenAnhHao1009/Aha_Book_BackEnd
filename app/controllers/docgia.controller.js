const ApiError = require("../api-error");
const ReaderService = require("../services/docgia.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  if (!req.body?.madocgia) {
    return next(new ApiError(400, "Mã độc giả không được rỗng"));
  }
  try {
    const readerService = new ReaderService(MongoDB.client);
    const reader = await readerService.create(req.body);
    return res.send(reader);
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi thêm 1 độc giả mới"));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const readerService = new ReaderService(MongoDB.client);
    const { name } = req.query;
    const { phone } = req.query;
    if (name) {
      documents = await readerService.findByName(name);
    } else if (phone) {
      documents = await readerService.findByPhone(phone);
    } else {
      documents = await readerService.find({});
    }
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi tìm kiếm tất cả độc giả"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const readerService = new ReaderService(MongoDB.client);
    const document = await readerService.findById(req.params.id);
    if (!document) {
      return next(
        new ApiError(404, `Không tim thấy mã độc giả ${req.params.id}`)
      );
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Có lỗi khi tìm một độc giả ${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const readerService = new ReaderService(MongoDB.client);
    const document = await readerService.delete(req.params.id);

    if (!document) {
      return next(
        new ApiError(404, `Không tìm thấy mã độc giả để xóa ${req.params.id}`)
      );
    }
    return res.send({ message: "Xóa thành công độc giả" });
  } catch (error) {
    return next(
      new ApiError(500, `Có lỗi khi xóa một độc giả ${req.params.id}`)
    );
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const readerService = new ReaderService(MongoDB.client);
    const deletedCount = await readerService.deleteAll();
    return res.send({ message: ` Xóa thành công ${deletedCount} độc giả` });
  } catch (error) {
    return next(new ApiError(500, "Có lỗi xảy ra khi xóa tất cả độc giả"));
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length == 0) {
    return next(new ApiError(400, "Dữ liệu cập nhật không được rỗng"));
  }
  try {
    const readerService = new ReaderService(MongoDB.client);
    const document = await readerService.update(req.params.id, req.body);
    if (!document) {
      return next(
        new ApiError(404, `Không tìm thấy mã độc giả ${req.params.id}`)
      );
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Có lỗi xảy ra khi cập nhật độc giả ${req.params.id}`)
    );
  }
};
