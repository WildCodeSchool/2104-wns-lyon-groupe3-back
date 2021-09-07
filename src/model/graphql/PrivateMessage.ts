import { Field, InputType, ObjectType } from "type-graphql";
import 'reflect-metadata';
import { Recipient } from "./Recipient";

@ObjectType()
@InputType("privateMessageInput")
export class PrivateMessage {
    @Field(type=>String)
    author : string;

    @Field(type=>[Recipient])
    recipients : Recipient[];

    @Field(type=>String, {nullable:true})
    object : string;

    @Field(type=>String)
    message : string;
}