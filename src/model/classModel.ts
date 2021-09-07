import mongoose, { Document } from "mongoose";
import { User } from "./graphql/User";
import { UserSchema } from "./userModel";
import { CourseDate } from "./graphql/CourseDate";

const Schema = mongoose.Schema;

const CourseDateSchema = new Schema(
    {
        teacherId: String,
        matter: String,
        day: String,
        startHour: String,
        endHour: String,
    }
)

export interface IClass extends Document{
    id: string,
    name: string,
    link: string,
    timetable: [CourseDate],
    principalTeacherId: string,
    classRepresentativesIds: [string]

}

const ClassSchema = new Schema(
    {
        id: String,
        name: String,
        link: String,
        timetable: [CourseDateSchema],
        princpalTeacherId: String,
        classRepresentativesIds: [String]
    }
)

const ClassModel:mongoose.Model<IClass> = mongoose.model("classes", ClassSchema);
export default ClassModel;