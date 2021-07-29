import { Arg, Query, Resolver, Mutation, FieldResolver, ObjectType, Args } from "type-graphql";
import { Class } from "../model/graphql/Class";
import { CourseDate } from "../model/graphql/CourseDate";
import ClassModel, { IClass } from "../model/classModel";
import { validate } from "class-validator";
import 'reflect-metadata';
import { User } from "../model/graphql/User";

@Resolver(Class)
export class ClassResolver{
    @Query(returns => [Class])
    public async getAllClass(): Promise<Array<IClass | null>> {
        const data = await ClassModel.find();
        return data;
    }

    @Query(returns => Class, {nullable: true})
    public async getClassById(@Arg('id', type => String) id: string): Promise<IClass | null>{
        return await ClassModel.findById(id);
    }

    @Mutation(returns => Class, {nullable: true})
    public async createClass(
        @Arg("name") name: string,
        @Arg("link") link: string,
        @Arg("timetable", ()=> CourseDate) timetable: CourseDate[],
        @Arg("principalTeacher") principalTeacher: User,
        @Arg("classRepresentative", ()=>User) classReprensentative: User[],
    ): Promise<IClass | null>{
        const newClass = new Class();
        
        newClass.name = name;
        newClass.link = link;
        newClass.timetable = timetable;
        newClass.principalTeacher = principalTeacher;
        newClass.classRepresentative = classReprensentative;

        const errors = await validate(newClass);

        if (errors.length>0) return null;

        const body = {...newClass, _id: undefined};

        ClassModel.init();

        const model = new ClassModel(body);
        const result = model.save();
        return result;
    }
}