
import { Field, InputType, ObjectType } from "type-graphql";
import { Address } from './Address'
import 'reflect-metadata';

@ObjectType()
@InputType("legalRepresentativeInput")
export class LegalRepresentative {
    @Field()
    lastname : string;

    @Field()
    firstname : string;

    @Field(()=> Address)
    address : Address;

    @Field()
    phone : string;
}