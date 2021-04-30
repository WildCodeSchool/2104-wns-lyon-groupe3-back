/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsEmail,  MaxLength, MinLength } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class User {
    
    @Field(type=>ID)
    _id = "";

    @MinLength(5)
    @MaxLength(64)
    @Field(type=>String)
    firstname = "";

    @MinLength(1)
    @MaxLength(64)
    @Field(type=>String)
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