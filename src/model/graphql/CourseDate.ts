import { Field, InputType, ObjectType } from "type-graphql";
import 'reflect-metadata';
import { User } from "./User";

@ObjectType()
@InputType("courseDateInput")
export class CourseDate {

    @Field()
    teacher : User;

    @Field()
    matter : string;

    @Field()
    day: string;

    @Field()
    startHour : string;

    @Field()
    endHour: string;
}