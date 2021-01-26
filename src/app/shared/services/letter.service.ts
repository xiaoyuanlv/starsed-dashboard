import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: "root",
})
export class LetterService {
  
  constructor(private firestore: AngularFirestore) {}

  GetSentLetter(uid, afterdoc, limitcount) {
    if (afterdoc != null) {
      return this.firestore
        .collection("letter/sent/" + uid, (ref) =>
          ref.orderBy("sentdate", "desc").startAfter(afterdoc).limit(limitcount)
        )
        .snapshotChanges();
    } else {
      return this.firestore
        .collection("letter/sent/" + uid, (ref) =>
          ref.orderBy("sentdate", "desc").limit(limitcount)
        )
        .snapshotChanges();
    }
  }

  GetReceivedLetter(toEmail, afterdoc, limitcount) {
    if (afterdoc != null) {
      return this.firestore
        .collection("letter/receive/" + toEmail, (ref) =>
          ref.orderBy("sentdate", "desc").startAfter(afterdoc).limit(limitcount)
        )
        .snapshotChanges();
    } else {
      return this.firestore
        .collection("letter/receive/" + toEmail, (ref) =>
          ref.orderBy("sentdate", "desc").limit(limitcount)
        )
        .snapshotChanges();
    }
  }

  UpdateReceiverLetterRead(data, email, id) {
    try {
      this.firestore
        .collection("letter")
        .doc("receive")
        .collection(email)
        .doc(id).ref.set(data);
    } catch (ex) {
      window.alert(ex);
    }
  }

  SetSentLetter(data, uid) {
    try {
      this.firestore.collection("letter").doc("sent").collection(uid).add(data);
      window.alert("success");
    } catch (ex) {
      window.alert(ex);
    }
  }

  SetReceiverLetter(data, toMail) {
    try {
      this.firestore
        .collection("letter")
        .doc("receive")
        .collection(toMail)
        .add(data);
    } catch (ex) {
      window.alert(ex);
    }
  }

  DeleteReceivedLetter(tomail, id) {
    this.firestore.collection("letter").doc("receive").collection(tomail).doc(id).delete();
  }

  DeleteSentLetter(uid, id) {
    this.firestore.collection("letter").doc("sent").collection(uid).doc(id).delete();
  }

  UpdateLetter(tomail, letter) {
    this.firestore
      .doc("letter/receive/" + tomail + "/" + letter.id)
      .update(letter);
  }

  GetLetterStamp() {
    return this.firestore.collection("letterstamps").snapshotChanges();
  }

  GetUnreadReceivedLetter(toMail) {
      return this.firestore
        .collection("letter/receive/" + toMail, (ref) =>
          ref.where("readStatus","==",false)
      ).get();
  }

}
