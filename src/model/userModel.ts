import mongoose, { Document } from "mongoose";
import { Address } from "./graphql/Address";

const Schema = mongoose.Schema;

const subSchema = new Schema({
    street: String,
    postalCode: String,
    city: String
})

export interface IUser extends Document {
    id: string,
    firstname: string, 
    lastname: string,
    birthday: string,
    email: string,
    password: string,
    address: Address,
    role: string,
    isActive: string,
    picture: string
}

const UserSchema = new Schema(
    {
        id: String,
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        birthday: String,
        email: { type: String, required: true, unique: true },
        password: { type: String },
        address: { type: subSchema },
        role: { type: String, enum: ['STUDENT', 'TEACHER', 'ADMINISTRATIVE'], default: 'STUDENT', required: true },
        isActive: { type: String, enum: ['ACTIVE', 'BLOCKED'], default: 'ACTIVE', required: true },
        picture: String
    }
)

const UserModel:mongoose.Model<IUser> = mongoose.model("users", UserSchema);
export default UserModel;