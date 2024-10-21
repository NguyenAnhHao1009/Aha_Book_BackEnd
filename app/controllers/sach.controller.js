const ApiError = require("../api-error");
const BookService = require("../services/sach.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  if (!req.body?.masach) {
    return next(new ApiError(400, "Mã sách không được rỗng"));
  }
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.create(req.body);
    if (!document) {
      return next(new ApiError(400, "Nhà xuất bản không tồn tại"));
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, "Có lỗi xảy ra khi thêm một sản phẩm"));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  try {
    const bookService = new BookService(MongoDB.client);

    const { name } = req.query;
    const { author } = req.query;

    if (name) {
      documents = await bookService.findByName(name);
    } else if (author) {
      documents = await bookService.findByAuthor(author);
    } else {
      documents = await bookService.find({});
    }
    console.log(documents);
    return res.send(documents);
  } catch (error) {
    return next(new ApiError(500, "Lỗi khi tìm tất cả các sách"));
  }
};

exports.findOne = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.findById(req.params.id);
    if (!document) {
      return next(
        new ApiError(404, `Không tìm thấy mã sách phù hợp: ${req.params.id}`)
      );
    }
    return res.send(document);
  } catch (error) {
    return next(new ApiError(500, `Có Lỗi khi tìm sách id: ${req.params.id}`));
  }
};

exports.delete = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.deleteOne(req.params.id);
    if (!document) {
      return next(new ApiError(404, `Khong tìm thấy mã sách ${req.params.id}`));
    }
    return res.send({ message: `Xóa thành công sách ${req.params.id}` });
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi xóa một sách"));
  }
};

exports.deleteAll = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const deletedCount = await bookService.deleteAll();

    return res.send({ message: `Xoa thanh cong ${deletedCount} sách` });
  } catch (error) {
    return next(new ApiError(500, "Có lỗi khi xóa tất cả các sách"));
  }
};

exports.update = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.update(req.params.id, req.body);

    if (!document) {
      return next(new ApiError(404, `Khong tim thay sach ${req.params.id}`));
    }
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Có lỗi xảy ra khi cập nhật sách ${req.params.id}`)
    );
  }
};
