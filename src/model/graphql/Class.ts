import { Length, IsArray } from "class-validator";
import { Field, ID, ObjectType } from "type-graphql";
import { CourseDate } from "./CourseDate";
import 'reflect-metadata';

@ObjectType()
export class Class {

    @Field(type=>ID)
    _id = "";

    @Field(type => String)
    @Length(1, 64)
    name = "";

    @Field(type=>String, {nullable:true})
    link = "";

    // @IsArray()
    @Field(type=>[CourseDate], {nullable:true})
    timetable : CourseDate[];

    @Field(type=>String, {nullable:true})
    principalTeacherId : string;

    // @IsArray()
    @Field(type=>[String], {nullable:true})
    classRepresentativesIds : string[];
}