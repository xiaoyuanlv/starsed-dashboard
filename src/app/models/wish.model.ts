import { Timestamp } from "rxjs";

export class Wish {
    id: string;
    title: string;
    message: string;
    author: string;
    email: string;
    fulfilled: boolean;
    createdDate: Date;
    uid: string;
}
