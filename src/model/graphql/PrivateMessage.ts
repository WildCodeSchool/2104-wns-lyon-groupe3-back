import { Field, InputType, ObjectType } from "type-graphql";
import 'reflect-metadata';
import { Recipient } from "./Recipient";

@ObjectType()
@InputType("privateMessageInput")
export class PrivateMessage {
    @Field()
    author : string;

    @Field(type=>Recipient)
    recipient : Recipient[];

    @Field()
    object : string;

    @Field()
    message : string;
}