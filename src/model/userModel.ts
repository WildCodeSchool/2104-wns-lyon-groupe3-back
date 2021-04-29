import mongoose from "mongoose";

const Schema = mongoose.Schema;


const UserSchema = new Schema(
    {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        birthday: String,
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        address: { 
            
         },
        role: { type: String, enum: ['STUDENT', 'TEACHER', 'ADMINISTRATIVE'], default: 'STUDENT', required: true },
        isActive: { type: String, enum: ['ACTIVE', 'BLOCKED'], default: 'ACTIVE', required: true },
        picture: String
    }
)

const UserModel:mongoose.Model<any> = mongoose.model("users", UserSchema);
export default UserModel;