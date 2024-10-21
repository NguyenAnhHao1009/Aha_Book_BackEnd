class BorrowedBookTracking {
  constructor(client) {
    this.BorrowedBookTracking = client.db().collection("theodoimuonsach");
  }
  extractBorrowedBookTrackingData(payload) {
    const borrowedBookTrackingData = {
      madocgia: payload.madocgia,
      masach: payload.masach,
      ngaymuon: payload.ngaymuon,
      ngaytra: payload.ngaytra ?? null,
      msnv: payload.msnv,
    };
    Object.keys(borrowedBookTrackingData).forEach(
      (key) =>
        borrowedBookTrackingData[key] === undefined &&
        delete borrowedBookTrackingData[key]
    );
    return borrowedBookTrackingData;
  }

  async create(payload) {
    const data = this.extractBorrowedBookTrackingData(payload);
    const document = await this.BorrowedBookTracking.findOneAndUpdate(
      {
        $and: [
          { madocgia: data.madocgia },
          { masach: data.masach },
          { ngaymuon: data.ngaymuon },
        ],
      },
      { $set: data },
      {
        upsert: true,
        returnDocument: "after",
      }
    );
    return document;
  }
  async update({ madocgia, masach, ngaymuon }, payload = {}) {
    const data = this.extractBorrowedBookTrackingData(payload);

    const document = await this.BorrowedBookTracking.findOneAndUpdate(
      {
        $and: [
          { madocgia: madocgia },
          { masach: masach },
          { ngaymuon: ngaymuon },
        ],
      },
      { $set: data },
      { returnDocument: "after" }
    );
    return document;
  }
  async find(filter) {
    const documents = await this.BorrowedBookTracking.find(filter);
    return await documents.toArray();
  }

  async findByTimeStartToTimeEnd(startTime, endTime) {
    const document = await this.BorrowedBookTracking.find({
      $and: [
        {
          ngaymuon: { $gte: startTime },
        },
        {
          ngaytra: { $lte: endTime },
        },
      ],
    });
    return document;
  }

  //   async findByReader(name) {
  //     const document = await this.BorrowedBookTracking.aggregate([
  //       {
  //         $lookup: {
  //           from: "docgia",
  //           localField: "madocgia",
  //           foreignField: "madocgia",
  //           as: "docgia_info",
  //         },
  //       },
  //       {
  //         $unwind: "$docgia_info",
  //       },
  //       {
  //         $match: {
  //           "docgia_info.ten": { $regex: new RegExp(name, "i") }, // Tìm không phân biệt chữ hoa/thường
  //         },
  //       },
  //       {
  //         $project: {
  //           madocgia: 1,
  //           masach: 1,
  //           ngaymuon: 1,
  //           ngaytra: 1,
  //           "docgia_info.ten": 1,
  //           "docgia_info.holot": 1,
  //         },
  //       },
  //     ]);
  //     console.log("C");

  //     return await document.toArray();
  //   }

  async findOne(madocgia, masach, ngaymuon) {
    const document = await this.BorrowedBookTracking.findOne({
      $and: [
        { madocgia: madocgia },
        { masach: masach },
        { ngaymuon: ngaymuon },
      ],
    });

    return document;
  }
}

module.exports = BorrowedBookTracking;
