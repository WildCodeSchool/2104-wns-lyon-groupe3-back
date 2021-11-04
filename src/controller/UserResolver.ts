/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// import { User } from "../model/graphql/User";
// import { Address } from "../model/graphql/Address";
// import UserModel from "../model/userModel";
// import bcrypt from 'bcrypt';
// import generator from 'generate-password';
// import { validate } from "class-validator";
import 'reflect-metadata';

const userResolvers = {
    Query: {
        currentUser: (parent: any, args: any, context: { getUser: () => any; }):any => context.getUser(),
    },
}

export default userResolvers;

// @Resolver(User)
// export class UserResolver {
//     @Query(returns => [User])
//     public async getAllUsers(): Promise<Array<IUser | null>> {
//         const data = await UserModel.find();
//         return data;
//     }

    // @Query(returns => User, { nullable: true })
    // public async getUserById(@Arg('id', type => String) id: string): Promise<IUser | null> {
    //     return await UserModel.findById(id);
    // }

    // @Query(returns => User, { nullable: true })
    // public async getUserByEmail(@Arg('email', type => String) email: string): Promise<IUser | null> {
    //     return await UserModel.findOne({ email: email }) || null;
    // }

    // @Query(returns => [User])
    // public async getUsersByRole(@Arg('role', type => String) role: string): Promise<Array<IUser | null>> {
    //     return await UserModel.find({ role: role });
    // }

    // @Query(returns => [User])
    // public async getUsersByIsActive(@Arg('isActive', type => String) isActive: string): Promise<Array<IUser | null>> {
    //     return await UserModel.find({ isActive: isActive });
    // }

    // @Query(returns => [User])
    // public async getUsersByFirstname(@Arg('firstname', type => String) firstname: string): Promise<Array<IUser | null>> {
    //     return await UserModel.find({ firstname: firstname });
    // }

    // @Query(returns => [User])
    // public async getUsersByLastname(@Arg('lastname', type => String) lastname: string): Promise<Array<IUser | null>> {
    //     return await UserModel.find({ lastname: lastname });
    // }

    // @Mutation(returns => User, { nullable: true })
    // public async createUser(
    //     @Arg("firstname") firstname: string,
    //     @Arg("lastname") lastname: string,
    //     @Arg("email") email: string,
    //     @Arg("address") address: Address,
    //     @Arg("role", { defaultValue: 'STUDENT' }) role: string,
    //     @Arg("isActive", { defaultValue: 'ACTIVE' }) isActive: string,
    //     @Arg("birthday", { defaultValue: '', nullable: true }) birthday?: string,
    //     @Arg("picture", { defaultValue: '', nullable: true }) picture?: string,
    // ): Promise<IUser | null> {

    //     const passClear = generator.generate({
    //         length: 12,
    //         numbers: true,
    //         excludeSimilarCharacters: true,
    //         symbols: true,
    //         strict: true
    //     })

    //     const passHash = bcrypt.hashSync(passClear, 10);

    //     const user = new User();
    //     user.firstname = firstname;
    //     user.lastname = lastname;
    //     user.birthday = birthday || "";
    //     user.email = email;
    //     user.address = address;
    //     user.role = role;
    //     user.isActive = isActive;
    //     user.picture = picture || "";

    //     const errors = await validate(user);

    //     if (errors.length > 0) return null;
        
    //     const body = {...user, _id: undefined, password: passHash};

    //     UserModel.init();

    //     const model = new UserModel(body);
    //     const result = model.save();
    //     return result;
    // }

    // @Mutation(returns => User, { nullable: true })
    // public async updateUser(
    //     @Arg("id") id: string,
    //     @Arg("firstname") firstname: string,
    //     @Arg("lastname") lastname: string,
    //     @Arg("email") email: string,
    //     @Arg("address") address: Address,
    //     @Arg("role", { defaultValue: 'STUDENT' }) role: string,
    //     @Arg("isActive", { defaultValue: 'ACTIVE' }) isActive: string,
    //     @Arg("birthday", { defaultValue: '', nullable: true }) birthday?: string,
    //     @Arg("picture", { defaultValue: '', nullable: true }) picture?: string,
    // ): Promise<IUser | null> {

    //     const currentUser:any = await UserModel.findById(id);

    //     const user = new User();
    //     user.firstname = firstname !== currentUser?.firstname ? firstname : currentUser?.firstname;
    //     user.lastname = lastname !== currentUser?.lastname ? lastname : currentUser?.lastname;
    //     user.email = email !== currentUser?.email ? email : currentUser?.email;
    //     user.address = address !== currentUser?.address ? address : currentUser?.address;
    //     user.role = role !== currentUser?.role ? role : currentUser?.role;
    //     user.isActive = isActive !== currentUser?.isActive ? isActive : currentUser?.isActive;
    //     user.birthday = birthday !== currentUser?.birthday ? birthday : currentUser?.birthday;
    //     user.picture = picture !== currentUser?.picture ? picture : currentUser?.picture;

    //     const errors = await validate(user);
        
    //     //TODO errors is an array of validation errors
    //     if (errors.length > 0) return null;
       
    //     //TODO value of password will be changed when we will manage the modification of it
    //     const body = {...user, _id: id, password: currentUser?.password};

    //     await UserModel.findById(id).update(body);
    //     return await UserModel.findById(id);
    // }

    // @Mutation(returns => User, { nullable: true })
    // public async deleteUser(
    //     @Arg("id") id: string,
    // ): Promise<IUser | null> {
    //     const user = await UserModel.findById(id);
    //     if (user !== null) await UserModel.deleteOne({ _id: id });
    //     return user;
    // }
// }