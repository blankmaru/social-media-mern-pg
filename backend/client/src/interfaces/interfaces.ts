export interface IUser {
    id: string;
    username: string;
    email: string;
    isAdmin: boolean;
    friends: Array<IUser>,
    posts: []
}

export interface IPost {
    id: string;
    title: string;
    content: string;
    author: IUser;
    likes: number;
    comments: Array<string>;
}