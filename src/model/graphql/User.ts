/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsEmail,  Length, MinLength, MaxLength } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";
import 'reflect-metadata';

@ObjectType()
export class User {

    @Field(type=>ID)
    _id = "";

    @Field(type => String)
    @Length(5, 64)
    firstname = "";

    @Field(type => String)
    @MinLength(5)
    @MaxLength(64)
    lastname = "";

    //@IsDate()
    @Field(type=>String, {nullable: true})
    birthday = "";

    @IsEmail()
    @Field(type=>String)
    email = "";

    @Field(type=>String)
    password = "";

    @Field(type=>String)
    address = "";

    @Field(type=>String)
    role = "STUDENT";

    @Field(type=>String)
    isActive = "ACTIVE";

    @Field(type=>String, {nullable: true})
    picture = "";
}