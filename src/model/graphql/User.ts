/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsPostalCode, IsEmail,  Length, IsArray } from "class-validator";
import { emitSchemaDefinitionFileSync, Field, ID, InputType, ObjectType } from "type-graphql";
import 'reflect-metadata';
import { IUser } from "../userModel";
import { Address } from "./Address";

@ObjectType()
export class User {

    @Field(type=>ID)
    _id = "";

    @Field(type => String)
    @Length(1, 64)
    firstname = "";

    @Field(type => String)
    @Length(1, 64)
    lastname = "";

    //@IsDate()
    @Field(type=>String, {nullable: true})
    birthday = "";

    @IsEmail()
    @Field(type=>String)
    email = "";

    @Field(type=>String)
    password = "";

    // @IsArray()
    @Field(()=> Address)
    address = {
        street : "",
        postalCode : "",
        city : ""
    };

    @Field(type=>String)
    role = "STUDENT";

    @Field(type=>String)
    isActive = "ACTIVE";

    @Field(type=>String, {nullable: true})
    picture = "";
}