import { Arg, Query, Resolver, Mutation } from "type-graphql";
import { Class } from "../model/graphql/Class";
import { CourseDate } from "../model/graphql/CourseDate";
import ClassModel, { IClass } from "../model/classModel";
import { validate } from "class-validator";
import 'reflect-metadata';
import { User } from "../model/graphql/User";
import { ValidationError } from "apollo-server";

@Resolver(Class)
export class ClassResolver{
    @Query(returns => [Class])
    public async getAllClasses(): Promise<Array<IClass | null>> {
        const data = await ClassModel.find();
        return data;
    }

    @Query(returns => Class, {nullable: true})
    public async getClassById(@Arg('id', type => String) id: string): Promise<IClass | null>{
        return await ClassModel.findById(id);
    }
    
    @Query(returns => [Class], {nullable: true})
    public async getClassesByName(@Arg('name', type => String) name: string): Promise<IClass[] | null>{
        return await ClassModel.find({name: name});
    }

    @Mutation(returns => Class, {nullable: true})
    public async createClass(
        @Arg("name") name: string,
        @Arg("link", {nullable:true}) link: string,
        @Arg("timetable", ()=> [CourseDate], {nullable: true}) timetable: CourseDate[],
        @Arg("principalTeacherId", {nullable: true}) principalTeacherId: string,
        @Arg("classRepresentativesIds", ()=>[String],{nullable: true}) classReprensentativesIds: string[],
    ): Promise<IClass | null>{
        const newClass = new Class();
        
        newClass.name = name;
        newClass.link = link;
        newClass.timetable = timetable;
        newClass.principalTeacherId = principalTeacherId;
        newClass.classRepresentativesIds = classReprensentativesIds;

        const errors = await validate(newClass);

        if (errors.length>0){
            console.log(errors);
            return null;
        } 

        const body = {...newClass, _id: undefined};

        ClassModel.init();

        const model = new ClassModel(body);
        const result = model.save();
        return result;
    }
}