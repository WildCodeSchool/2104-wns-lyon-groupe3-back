import mongoose, { Document } from "mongoose"
import { Recipient } from "./graphql/Recipient";

const Schema = mongoose.Schema;

const RecipientSchema = new Schema(
    {
        userId: String
    }
)

export interface IPrivateMessage extends Document {
    author: string,
    recipient: [Recipient], 
    object: string,
    message: string,
}

export const PrivateMessageSchema = new Schema(
    {
        author: { type: String, required: true },
        recipient: { type: [RecipientSchema], required: true },
        object: String,
        message: { type: String, required: true },
    }
)

const PrivateMessageModel:mongoose.Model<IPrivateMessage> = mongoose.model("private_messages", PrivateMessageSchema);
export default PrivateMessageModel;