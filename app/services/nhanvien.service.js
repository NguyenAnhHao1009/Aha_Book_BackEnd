class StaffService {
  constructor(client) {
    this.Staff = client.db().collection("nhanvien");
  }
  extractStaffData(payload) {
    const staff = {
      msnv: payload.msnv,
      hotennv: payload.hotennv,
      password: payload.password,
      chucvu: payload.chucvu,
      diachi: payload.diachi,
      sodienthoai: payload.sodienthoai,
    };

    Object.keys(staff).forEach(
      (key) => staff[key] === undefined && delete staff[key]
    );
    return staff;
  }
  async create(payload) {
    const staff = this.extractStaffData(payload);

    const document = await this.Staff.findOneAndUpdate(
      {
        msnv: staff.msnv,
      },
      { $set: staff },
      {
        upsert: true,
        returnDocument: "after",
      }
    );
    return document;
  }
  async update(id, payload) {
    const staffUpdate = this.extractStaffData(payload);
    console.log(staffUpdate);

    const document = await this.Staff.findOneAndUpdate(
      { msnv: id },
      { $set: staffUpdate },
      { returnDocument: "after" }
    );

    return document;
  }

  async find(filter) {
    const result = await this.Staff.find(filter);
    return await result.toArray();
  }
  async findByName(name) {
    return await this.find({
      hotennv: { $regex: new RegExp(name, "i") },
    });
  }
  async findById(id) {
    return await this.Staff.findOne({
      msnv: id,
    });
  }
  async deleteAll() {
    const deletedCount = await this.Staff.deleteMany({});
    return deletedCount;
  }
  async deleteOne(id) {
    const result = await this.Staff.findOneAndDelete({
      msnv: id,
    });
    console.log(result);
    return result;
  }
}

module.exports = StaffService;
