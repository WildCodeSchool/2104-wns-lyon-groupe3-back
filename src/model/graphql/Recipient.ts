import { Field, ObjectType, InputType } from "type-graphql";
import 'reflect-metadata';

@ObjectType()
@InputType("recipientInput")
export class Recipient {

    @Field()
    userId: string;

}