/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class User {
    @Field(type=>ID)
    _id = "";

    @Field(type=>String)
    firstname = "";

    @Field(type=>String)
    lastname = "";

    @Field(type=>String, {nullable: true})
    birthday = "";

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