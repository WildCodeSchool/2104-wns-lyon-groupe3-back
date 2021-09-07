import { Field, InputType, ObjectType } from "type-graphql";
import 'reflect-metadata';

@ObjectType()
@InputType("courseDateInput")
export class CourseDate {

    @Field()
    teacherId : string;

    @Field()
    matter : string;

    @Field()
    day : string;

    @Field()
    startHour : string;

    @Field()
    endHour : string;
}