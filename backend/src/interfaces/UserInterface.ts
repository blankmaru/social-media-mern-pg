import { IPost } from "../../client/src/interfaces/interfaces";

export interface IUser {
    username: string;
    isAdmin: boolean;
    id: string;
    friends: Array<object>;
    posts: Array<IPost>;
}

export interface IDatabaseUser {
    username: string;
    password: string;
    email: string;
    isAdmin: boolean;
    id: string;
    friends: Array<object>;
    posts: Array<IPost>;
}