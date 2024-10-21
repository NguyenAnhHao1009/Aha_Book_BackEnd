const ApiError = require("../api-error");
const StaffService = require("../services/nhanvien.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  if (!req.body?.msnv) {
    return next(new ApiError(400, "Mã số nhân viên là bắt buộc"));
  }
  try {
    const staffService = new StaffService(MongoDB.client);
    const document = await staffService.create(req.body);
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Có lỗi xảy ra khi thêm mới một nhân viên"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const staffService = new StaffService(MongoDB.client);
    const document = await staffService.findById(req.params.id);
    if (!document) {
      return next(
        new ApiError(404, `Không tìm thấy nhân viên ${req.params.id}`)
      );
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Lỗi khi tìm nhân viên ${req.params.id} `));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const staffService = new StaffService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await staffService.findByName(name);
    } else {
      documents = await staffService.find({});
    }
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "Có lỗi xảy ra khi tím kiếm nhân viên"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const staffService = new StaffService(MongoDB.client);
    const document = await staffService.update(req.params.id, req.body);
    if (!document) {
      return next(
        new ApiError(404, `Không tìm thấy mã nhân viên ${req.params.id}`)
      );
    }
    return res.send({ message: "Cập nhật thành công nhân viên" });
  } catch (error) {
    return next(
      new ApiError(500, ` Có lỗi khi cập nhật nhân viên ${req.params.id}`)
    );
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const staffService = new StaffService(MongoDB.client);
    const result = await staffService.deleteAll();
    return res.send(`${result.deletedCount} nhân viên đã bị xóa`);
  } catch (error) {
    return next(new ApiError(500, "Có lỗi xảy ra khi xóa tất cả nhân viên"));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const staffService = new StaffService(MongoDB.client);
    const document = await staffService.deleteOne(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Không tìm thấy mã nhân viên"));
    }

    return res.send({ message: `Xóa thành công nhân viên ${req.params.id}` });
  } catch (error) {
    return next(
      new ApiError(500, `Có lỗi xảy ra khi xóa nhân viên ${req.params.id}`)
    );
  }
};
