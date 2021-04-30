/* eslint-disable @typescript-eslint/no-unused-vars */
import { Arg, Query, Resolver } from "type-graphql";
import { User } from "../model/graphql/User";
import UserModel from "../model/UserModel";

@Resolver(User)
export class UserResolver {
    @Query(returns => User, {nullable: true})
    public async getUserById(@Arg('id', type => String) id: string):Promise<void> {
        return await UserModel.findById(id);
    }

    @Query(returns => User, {nullable: true})
    public async getUserByEmail(@Arg('email', type => String) email: string):Promise<void> {
        return await UserModel.findOne({ email: email })||null;
    }

    @Query(returns => [User])
    public async getUsersByRole(@Arg('role', type => String) role: string):Promise<Array<void>> {
        return await UserModel.find({ role: role });
    }

    @Query(returns => [User])
    public async getUsersByIsActive(@Arg('isActive', type => String) isActive: string):Promise<Array<void>> {
        console.log(isActive);
        return await UserModel.find({ isActive: isActive });
    }

    @Query(returns => [User])
    public async getAllUsers():Promise<Array<void>> {
        return await UserModel.find() 
    }
}
