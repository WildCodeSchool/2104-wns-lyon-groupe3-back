import { IsPostalCode, IsEmail,  Length, IsArray } from "class-validator";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import 'reflect-metadata';

@InputType()
export class Address {
    @Field(type=>String)
    street = "";

    @Field(type=>String)
    postalCode = "";

    @Field(type=>String)
    city = "";
}