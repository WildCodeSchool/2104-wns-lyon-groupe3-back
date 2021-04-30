/* eslint-disable @typescript-eslint/no-unused-vars */
import { Arg, Query, Resolver, Mutation } from "type-graphql";
import { User } from "../model/graphql/User";
import UserModel from "../model/UserModel";

@Resolver(User)
export class UserResolver {
    @Query(returns => User, {nullable: true})
    public async getUserById(@Arg('id', type => String) id: string):Promise<User> {
        return await UserModel.findById(id);
    }

    @Query(returns => User, {nullable: true})
    public async getUserByEmail(@Arg('email', type => String) email: string):Promise<User> {
        return await UserModel.findOne({ email: email })||null;
    }

    @Query(returns => [User])
    public async getUsersByRole(@Arg('role', type => String) role: string):Promise<Array<User>> {
        return await UserModel.find({ role: role });
    }

    @Query(returns => [User])
    public async getUsersByIsActive(@Arg('isActive', type => String) isActive: string):Promise<Array<User>> {
        console.log(isActive);
        return await UserModel.find({ isActive: isActive });
    }

    @Query(returns => [User])
    public async getAllUsers():Promise<Array<User>> {
        return await UserModel.find() 
    }

    @Mutation(returns => User)
    public async createUser(
        @Arg("firstname") firstname: string,
        @Arg("lastname") lastname: string,
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Arg("address") address: string,
        @Arg("role", {defaultValue: 'STUDENT'}) role: string,
        @Arg("isActive", {defaultValue: 'ACTIVE'}) isActive: string,
        @Arg("birthday", {defaultValue: '', nullable: true}) birthday?: string,
        @Arg("picture", {defaultValue: '', nullable: true}) picture?: string,
    ):Promise<User> {
        await UserModel.init();
        const body: any = {
            firstname,
            lastname,
            birthday,
            email,
            password,
            address,
            role,
            isActive,
            picture
        };
        const model = new UserModel(body);
        const result = await model.save();
        return result;
    }

}
