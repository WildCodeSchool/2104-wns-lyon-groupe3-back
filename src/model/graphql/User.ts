/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsPostalCode, IsEmail,  Length, IsArray } from "class-validator";
import { emitSchemaDefinitionFileSync, Field, ID, InputType, ObjectType } from "type-graphql";
import 'reflect-metadata';
import { IUser } from "../userModel";
import { Address } from "./Address";

@ObjectType()
@InputType("userInput")
export class User {

    @Field(type=>ID)
    _id : string;

    @Field(type => String)
    @Length(1, 64)
    firstname :string;

    @Field(type => String)
    @Length(1, 64)
    lastname : string;

    //@IsDate()
    @Field(type=>String, {nullable: true})
    birthday : string;

    @IsEmail()
    @Field(type=>String)
    email : string;

    @Field(type=>String)
    password : string;

    // @IsArray()
    @Field(()=> Address)
    address : Address;

    @Field(type=>String, {defaultValue: "STUDENT"})
    role :string;

    @Field(type=>String, {defaultValue:"ACTIVE"})
    isActive: string;

    @Field(type=>String, {nullable: true})
    picture : string
}
