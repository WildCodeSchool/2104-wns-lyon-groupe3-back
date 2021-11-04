import { FilterQuery } from "mongoose";
import UserModel, { IUser } from "../model/userModel";

async function getAllUsers():Promise<Array<IUser | null>> {
    const data = await UserModel.find();
    return data;
}

async function getUserById(id: FilterQuery<IUser> | undefined):Promise<IUser | null> {
    return await UserModel.findOne(id);
}

export default {
    getAllUsers,
    getUserById
}