import mongoose, { Document } from "mongoose";
import { User } from "./graphql/User";
import { UserSchema } from "./userModel";
import { CourseDate } from "./graphql/CourseDate";

const Schema = mongoose.Schema;

const CourseDateSchema = new Schema(
    {
        teacher: UserSchema,
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
    principalTeacher: User,
    classRepresentative: [User]

}

const ClassSchema = new Schema(
    {
        id: String,
        name: String,
        link: String,
        timetable: [CourseDateSchema],
        princpalTeacher: UserSchema,
        classRepresentative: [UserSchema]
    }
)

const ClassModel:mongoose.Model<IClass> = mongoose.model("classes", ClassSchema);
export default ClassModel;