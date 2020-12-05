export interface IUser {
    id: string;
    username: string;
    email: string;
    isAdmin: boolean;
    friends: Array<IUser>;
    posts: number[];
    phone: string;
    address: string;
    bio: string;
    avatar: string;
    bgcover: string;
    smaccounts: Array<ISocialAccounts>;
}

export interface IPost {
    id: string;
    title: string;
    content: string;
    author: IUser;
    likes: number;
    comments: Array<string>;
    image: string;
}

export interface IMessage {
    user: string;
    text: string;
}

export interface IChat {
    id: string;
    title: string;
    url: string;
}

interface IInfo {
    postId: string;
    message: string;
}

export interface IReport {
    id: string;
    info: IInfo;
}

export interface IComment {
    author: string;
    content: string;
}

export interface IImage {
    image: string;
}

export interface ISocialAccounts {
    instagram: string;
    facebook: string;
    google: string;
}