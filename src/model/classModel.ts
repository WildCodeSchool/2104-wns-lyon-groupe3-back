import mongoose, { Document } from "mongoose";
import { User } from "./graphql/User";
import { CourseDate } from "./graphql/CourseDate";

const Schema = mongoose.Schema;

export interface IClass extends Document{
    id: string,
    name: string,
    link: string,
    timetable: [CourseDate],
    principalTeacher: User,
    classRepresentative: [User]

}

const ClassSchema = new Schema(
    {
        id: String,
        name: String,
        link: String,
        timetable: [CourseDate],
        princpalTeacher: User,
        classRepresentative: [User]
    }
)

const ClassModel:mongoose.Model<IClass> = mongoose.model("classes", ClassSchema);
export default ClassModel;