const ApiError = require("../api-error");
const MongoDB = require("../utils/mongodb.util");
const PublisherService = require("./nhaxuatban.service");

class BookService {
  constructor(client) {
    this.Book = client.db().collection("sach");
  }
  extractBookData(data) {
    const book = {
      masach: data.masach,
      tensach: data.tensach,
      dongia: data.dongia,
      soquyen: data.soquyen,
      namxuatban: data.namxuatban,
      manxb: data.manxb,
      tacgia_nguongoc: data.tacgia_nguongoc,
    };

    Object.keys(book).forEach(
      (key) => book[key] === undefined && delete book[key]
    );
    return book;
  }

  async create(payload) {
    const data = this.extractBookData(payload);
    const publisherService = new PublisherService(MongoDB.client);
    const isExistingPublisher = await publisherService.findById(data.manxb);
    console.log(isExistingPublisher);
    if (!isExistingPublisher) {
      return null;
    }
    const document = await this.Book.findOneAndUpdate(
      { masach: data.masach },
      { $set: data },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    return document;
  }

  async update(id, payload) {
    const data = this.extractBookData(payload);
    const document = await this.Book.findOneAndUpdate(
      { masach: id },
      { $set: data },
      {
        returnDocument: "after",
      }
    );
    return document;
  }

  async find(filter) {
    const cursor = await this.Book.find(filter);
    return await cursor.toArray();
  }
  async findByName(name) {
    return await this.find({ tensach: { $regex: new RegExp(name, "i") } });
  }
  async findByAuthor(author) {
    return await this.find({
      tacgia_nguongoc: { $regex: new RegExp(author, "i") },
    });
  }
  async findByPublisherId(id) {
    return await this.find({
      manxb: id,
    });
  }

  async findById(id) {
    const document = await this.Book.findOne({
      masach: id,
    });
    return document;
  }

  async deleteAll() {
    const result = await this.Book.deleteMany({});
    return result.deletedCount;
  }

  async deleteOne(id) {
    const document = await this.Book.findOneAndDelete(
      {
        masach: id,
      },
      { returnDocument: "after" }
    );
    return document;
  }
}

module.exports = BookService;
