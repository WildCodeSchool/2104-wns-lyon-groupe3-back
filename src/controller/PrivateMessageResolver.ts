import { Arg, Query, Resolver, Mutation } from "type-graphql";
import { Recipient } from "../model/graphql/Recipient";
import { PrivateMessage } from "../model/graphql/PrivateMessage";
import PrivateMessageModel, { IPrivateMessage } from "../model/privateMessageModel";
import { validate } from "class-validator";
import 'reflect-metadata';

@Resolver(PrivateMessage)
export class PrivateMessageResolver{
    @Query(returns => [PrivateMessage])
    public async getAllPrivateMessageForUser(): Promise<Array<IPrivateMessage | null>> {
        //TODO REQUETE
        const data = await PrivateMessageModel.find();
        return data;
    }

    @Mutation(returns => PrivateMessage, {nullable: true})
    public async createPrivateMessage(
        @Arg("author") author: string,
        @Arg("recipients", () => [Recipient]) recipients: Recipient[],
        @Arg("object", {nullable:true}) object: string,
        @Arg("message") message: string,
    ): Promise<IPrivateMessage | null>{
        const newPrivateMessage = new PrivateMessage();
        
        newPrivateMessage.author = author;
        newPrivateMessage.recipients = recipients;
        newPrivateMessage.object = object;
        newPrivateMessage.message = message;

        const errors = await validate(newPrivateMessage);

        if (errors.length>0){
            console.log(errors);
            return null;
        } 

        const body = {...newPrivateMessage, _id: undefined};

        PrivateMessageModel.init();

        const model = new PrivateMessageModel(body);
        const result = model.save();
        return result;
    }
}