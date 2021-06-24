import { IsPostalCode } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";
import 'reflect-metadata';

@ObjectType()
@InputType("addressInput")
export class Address {
    @Field()
    street : string;

    @IsPostalCode("FR")
    @Field()
    postalCode : string;

    @Field()
    city : string;
}