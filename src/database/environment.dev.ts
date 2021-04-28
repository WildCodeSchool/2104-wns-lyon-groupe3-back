import * as dotenv from "dotenv";

dotenv.config();

const options =  {useNewUrlParser: true, useUnifiedTopology: true}; 
const db = process.env.DATABASE_URL;

type Options = {
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;
}

export interface IConfig{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    db:any;
    options: Options; 
    serverPort:number
}

export const config:IConfig = {
    db: db, 
    options: options, 
    serverPort: 5000
};