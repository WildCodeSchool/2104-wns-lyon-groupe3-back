/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Arg, Query, Resolver, Mutation } from "type-graphql";
import { User } from "../model/graphql/User";
import UserModel, { IUser } from "../model/userModel";
import bcrypt from 'bcrypt';
import generator from 'generate-password';
// import { validate } from "class-validator";
const { validate } = require("class-validator");
@Resolver(User)
export class UserResolver {
    @Query(returns => User, { nullable: true })
    public async getUserById(@Arg('id', type => String) id: string): Promise<IUser | null> {
        return await UserModel.findById(id);
    }

    @Query(returns => User, { nullable: true })
    public async getUserByEmail(@Arg('email', type => String) email: string): Promise<IUser | null> {
        return await UserModel.findOne({ email: email }) || null;
    }

    @Query(returns => [User])
    public async getUsersByRole(@Arg('role', type => String) role: string): Promise<Array<IUser | null>> {
        return await UserModel.find({ role: role });
    }

    @Query(returns => [User])
    public async getUsersByIsActive(@Arg('isActive', type => String) isActive: string): Promise<Array<IUser | null>> {
        console.log(isActive);
        return await UserModel.find({ isActive: isActive });
    }

    @Query(returns => [User])
    public async getAllUsers(): Promise<Array<IUser | null>> {
        const data = await UserModel.find();
        return data;
    }

    @Mutation(returns => User)
    public async createUser(
        @Arg("firstname") firstname: string,
        @Arg("lastname") lastname: string,
        @Arg("email") email: string,
        @Arg("address") address: string,
        @Arg("role", { defaultValue: 'STUDENT' }) role: string,
        @Arg("isActive", { defaultValue: 'ACTIVE' }) isActive: string,
        @Arg("birthday", { defaultValue: '', nullable: true }) birthday?: string,
        @Arg("picture", { defaultValue: '', nullable: true }) picture?: string,
    ): Promise<IUser | any> {

        const passClear = generator.generate({
            length: 12,
            numbers: true,
            excludeSimilarCharacters: true,
            symbols: true,
            strict: true
        })

        if (birthday === undefined) {
            birthday = '';
        }

        if (picture === undefined) {
            picture = '';
        }

        console.log(passClear);

        const passHash = bcrypt.hashSync(passClear, 10);

        console.log(passHash);

        const user = new User();
        user.firstname = firstname;
        user.lastname = lastname;
        user.birthday = birthday;
        user.email = email;
        user.address = address;
        user.role = role;
        user.isActive = isActive;
        user.picture = picture;

        validate(user).then((errors:any) => {
            // errors is an array of validation errors
            if (errors.length > 0) {
                console.log('validation failed. errors: ', errors);
            } else {
                console.log('validation succeed');
            }
        });

        const body = {
            firstname: user.firstname,
            lastname: user.lastname,
            birthday: user.birthday,
            email: user.email,
            password: passHash,
            address: user.address,
            role: user.role,
            isActive: user.isActive,
            picture: user.picture
        };

        UserModel.init();

        const model = new UserModel(body);
        const result = model.save();
        return result;
    }

    @Mutation(returns => User)
    public async updateUser(
        @Arg("id") id: string,
        @Arg("firstname") firstname: string,
        @Arg("lastname") lastname: string,
        @Arg("email") email: string,
        @Arg("address") address: string,
        @Arg("role", { defaultValue: 'STUDENT' }) role: string,
        @Arg("isActive", { defaultValue: 'ACTIVE' }) isActive: string,
        @Arg("birthday", { defaultValue: '', nullable: true }) birthday?: string,
        @Arg("picture", { defaultValue: '', nullable: true }) picture?: string,
    ): Promise<IUser | null> {

        if (birthday === undefined) {
            birthday = "";
        }

        if (picture === undefined) {
            picture = "";
        }

        const user = new User();
        user.firstname = firstname;
        user.lastname = lastname;
        user.birthday = birthday;
        user.email = email;
        user.address = address;
        user.role = role;
        user.isActive = isActive;
        user.picture = picture;

        validate(user).then((errors:any) => {
            // errors is an array of validation errors
            if (errors.length > 0) {
                console.log('validation failed. errors: ', errors);
            } else {
                console.log('validation succeed');
            }
        });

        const body = {
            firstname: user.firstname,
            lastname: user.lastname,
            birthday: user.birthday,
            email: user.email,
            address: user.address,
            role: user.role,
            isActive: user.isActive,
            picture: user.picture
        };

        await UserModel.updateOne({ _id: id }, body);
        return await UserModel.findById(id);
    }

    @Mutation(returns => User)
    public async deleteUser(
        @Arg("id") id: string,
    ): Promise<IUser | null> {
        const user = await UserModel.findById(id);
        await UserModel.deleteOne({ _id: id });
        return user;
    }

}