import { Timestamp } from "rxjs";

export class Letter {
    id: string;
    stamp: string;
    senderuid: string;
    fromEmail: string;
    fromName: string;
    toEmail: string;
    toName: string;
    title: string;
    message: string;
    readStatus: boolean;
    sentdate: string;
}
