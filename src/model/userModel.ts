import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        id: Schema.Types.ObjectId,
        firstname: String,
        lastname: String,
        birthday: String,
        email: String,
        password: String,
        address: String,
        role: String,
        isActive: String,
        picture: String,
    }
)

const userModel:mongoose.Model<any> = mongoose.model("users", UserSchema);
export default userModel;
