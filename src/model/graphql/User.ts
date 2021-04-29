import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class User {
    @Field(type=>ID)
    _id:string = "";

    @Field(type=>String)
    firstname:string = "";

    @Field(type=>String)
    lastname:string = "";

    @Field(type=>String, {nullable: true})
    birthday:string = "";

    @Field(type=>String)
    email:string = "";

    @Field(type=>String)
    password:string = "";

    @Field(type=>String)
    address:string = "";

    @Field(type=>String)
    role:string = "STUDENT";

    @Field(type=>String)
    isActive:string = "ACTIVE";

    @Field(type=>String, {nullable: true})
    picture:string = "";
}