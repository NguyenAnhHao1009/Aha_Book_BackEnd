class PublisherService {
  constructor(client) {
    this.Publisher = client.db().collection("nhaxuatban");
  }
  extractPublisherData(payload) {
    const publisher = {
      manxb: payload.manxb,
      tennxb: payload.tennxb,
      diachi: payload.diachi,
    };

    Object.keys(publisher).forEach(
      (key) => publisher[key] === undefined && delete publisher[key]
    );
    return publisher;
  }
  async find(filter) {
    const cursor = await this.Publisher.find(filter);
    return await cursor.toArray();
  }
  async findByName(name) {
    return await this.find({
      tennxb: { $regex: new RegExp(name), $options: "i" },
    });
  }
  async findById(id) {
    const result = await this.Publisher.findOne({
      manxb: id,
    });
    return result;
  }
  async deleteAll() {
    const result = await this.Publisher.deleteMany({});
    return result.deletedCount;
  }
  async deleteOne(id) {
    const MongoDB = require("../utils/mongodb.util");
    const BookService = require("./sach.service");
    const bookService = new BookService(MongoDB.client);
    const existingInBook = await bookService.findByPublisherId(id);

    if (existingInBook.length > 0) {
      return {
        errorMessage: "Không thể xóa nhà xuất bản này vì có sách liên kết.",
      };
    }

    const result = await this.Publisher.findOneAndDelete({
      manxb: id,
    });

    return result;
  }

  async create(payload) {
    const publisher = this.extractPublisherData(payload);
    const result = await this.Publisher.findOneAndUpdate(
      { manxb: publisher.manxb },
      { $set: publisher },
      {
        returnDocument: "after",
        upsert: true,
      }
    );

    return result;
  }
  async update(id, payload) {
    const publisherUpdate = this.extractPublisherData(payload);
    const result = await this.Publisher.findOneAndUpdate(
      { manxb: id },
      { $set: publisherUpdate },
      {
        returnDocument: "after",
      }
    );

    return result;
  }
}

module.exports = PublisherService;
