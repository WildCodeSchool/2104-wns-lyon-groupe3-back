import * as dotenv from "dotenv";

dotenv.config();

const options = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, autoIndex: true };
const db = 'mongodb://127.0.0.1:27017/test';

type Options = {
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;
    useCreateIndex: boolean;
    autoIndex: boolean;
}

export interface IConfig {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    db: any;
    options: Options;
    serverPort: number;
    autoListen: boolean;
    verbose: boolean;

}

export const config: IConfig = {
    db: db,
    options: options,
    serverPort: 54999,
    autoListen: false,
    verbose: false
};