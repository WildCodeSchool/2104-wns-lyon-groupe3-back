import { Length, IsArray } from "class-validator";
import { emitSchemaDefinitionFileSync, Field, ID, ObjectType } from "type-graphql";
import { IClass } from "../classModel";
import { CourseDate } from "./CourseDate";
import { User } from "./User";
import 'reflect-metadata';

@ObjectType()
export class Class {

    @Field(type=>ID)
    _id = "";

    @Field(type => String)
    @Length(1, 64)
    name = "";

    //@IsDate()
    @Field(type=>String)
    link = "";

    @IsArray()
    @Field(type=>[CourseDate])
    timetable = [];

    @Field(type=>User)
    principalTeacher;

    @IsArray()
    @Field(type=>[User])
    classRepresentative = [];
}