import mongoose from "mongoose";

class DatabaseService {
  connection: typeof mongoose;
  async register() {
    this.connection = await mongoose.connect(process.env.MONGO_URI)
  }
}

export default new DatabaseService();
