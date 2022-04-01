import { User } from "./User";

export interface Message{
    sender:User,
    reciver:User,
    content:string,
    isRead:boolean,
    createdAt:string
}