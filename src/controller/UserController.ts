import UserModel from '../model/userModel';
import { Request, Response } from 'express';

export default class UserController {
    constructor() { }

    async read(parent:any, args: any) {
        return await UserModel.find();
    }
}