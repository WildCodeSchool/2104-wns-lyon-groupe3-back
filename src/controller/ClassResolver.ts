import { Arg, Query, Resolver, Mutation, FieldResolver, ObjectType } from "type-graphql";
import { Class } from "../model/graphql/Class";
import { CourseDate } from "../model/graphql/CourseDate";
import ClassModel, { IClass } from "../model/classModel";
import { validate } from "class-validator";
import 'reflect-metadata';

@Resolver(Class)
export class ClassResolver{
    @Query(returns => Class, {nullable: true})
    public async getClassById(@Arg('id', type => String) id: string): Promise<IClass | null>{
        return await ClassModel.findById(id);
    }
}