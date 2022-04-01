export interface User{
    _id:string,
    profilePic:string,
    bgImage:string,
    following:string[],
    followers:string[],
    name:string,
    surname:string,
    email:string,
    password:string,
    createdAt:string
}