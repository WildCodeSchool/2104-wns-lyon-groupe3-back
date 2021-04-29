import UserModel from '../model/userModel';
import { Request, Response } from 'express';

export default class UserController {
    constructor() { }

    async read(parent:any, args: any) {
        return await UserModel.find();
    }

    async create(parent:any, args: any, context:any, info:any) {
        console.log('ARGS :', args)
        await UserModel.init();
        const model = new UserModel(args);
        const result = await model.save();
        return result;
    }
}