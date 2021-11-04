import * as dotenv from "dotenv";

dotenv.config();

const options =  { autoIndex: true }; 
const db = process.env.DATABASE_URL;

type Options = {
    autoIndex: boolean;
}

export interface IConfig{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    db:any;
    options: Options; 
    serverPort:number;
    autoListen: boolean;
    verbose: boolean;
}

export const config:IConfig = {
    db: db, 
    options: options, 
    serverPort: 4000,
    autoListen: true,
    verbose: true
};