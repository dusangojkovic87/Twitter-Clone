import { User } from "./User";

export interface Notification{
    sender:User;
    reciver:User;
    content:string;
    type:string;  
}