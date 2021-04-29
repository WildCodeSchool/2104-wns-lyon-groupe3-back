import { Arg, Query, Resolver } from "type-graphql";
import { User } from "../model/graphql/User";
import UserModel from "../model/UserModel";
import mongoose from 'mongoose';

@Resolver(User)
export class UserResolver {
    @Query(returns => User, {nullable: true})
    public async getUserById(@Arg('id', type => String) id: String) {
        return await UserModel.findById(id);
    }

    @Query(returns => User, {nullable: true})
    public async getUserByEmail(@Arg('email', type => String) email: string) {
        return await UserModel.findOne({ email: email})||null;
    }

    @Query(returns => [User])
    public async getAllUsers() {
        return await UserModel.find() 
    }
}
