import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(private firestore: AngularFirestore) { }

  getInfo(id) {
    return this.firestore.collection('users').doc(id).get();
  }

  setInfo(data, id){
    try{
      const ref = this.firestore.doc('users/' + id);
      ref.set(data, {
        merge: true
      });
      window.alert('success');
    } catch(ex) {
      window.alert(ex);
    }
  }

  checkDeleteAccOrNot(uid) {
    return this.firestore.collection('deletion').doc(uid).get();
  }

  scheduleDeletion(data, uid) {
    try{
      const ref = this.firestore.collection('deletion').doc(uid);
      ref.set(data, {
        merge: true
      });
      window.alert('success');
    } catch(ex) {
      window.alert(ex);
    }
  }

  cancelDeletion(uid) {
    try{
      const ref = this.firestore.collection('deletion').doc(uid);
      ref.delete();
      window.alert('success');
    } catch(ex) {
      window.alert(ex);
    }
  }


  DeleteAcc(uid, email) {
    try {
    // Creativity
    this.firestore
      .collection("creativestar", (ref) => ref.where("uid", "==", uid))
      .get()
      .subscribe((v) => {
        v.forEach((element) => {
          element.ref.delete();
        });
      });

       // Letter

    this.firestore
      .collection("letter/receive/" + email)
      .get()
      .subscribe((v) => {
        v.forEach((element) => {
          element.ref.delete();
        });
      });

    this.firestore
      .collection("letter/sent/" + uid)
      .get()
      .subscribe((v) => {
        v.forEach((element) => {
          element.ref.delete();
        });
      });


       // Opportunity

    this.firestore
      .collection("causes", (ref) => ref.orderBy("title"))
      .get()
      .subscribe((v) => {
        v.forEach((element) => {
          this.firestore
            .collection("volunteer/" + element + "/opportunity", (ref) =>
              ref.where("uid", "==", uid)
            )
            .get()
            .subscribe((v) => {
              v.forEach((element) => {
                element.ref.delete();
              });
            });
        });
      });


      // Organization

    this.firestore
      .collection("vorganization", (ref) => ref.where("uid", "==", uid))
      .get()
      .subscribe((v) => {
        v.forEach((org) => {

          this.firestore
            .collection("causes", (ref) => ref.orderBy("title"))
            .get()
            .subscribe((v) => {
              v.forEach((cause) => {
                this.firestore
                  .collection("volunteer/" + cause + "/opportunity", (ref) =>
                    ref.where("organizationid", "==", org)
                  )
                  .get()
                  .subscribe((v) => {
                    v.forEach((opportunity) => {
                      opportunity.ref.delete();
                    });
                  });
              });
            });

            org.ref.delete();
        });
      });


      // Wish

      this.firestore
      .collection("wish", (ref) => ref.where("uid","==",uid))
      .get()
      .subscribe((v) => {
        v.forEach((element) => {
          element.ref.delete();
        });
      });

      // User Acc

      this.firestore
      .collection("users").doc(uid).delete();

      this.firestore
      .collection("deletion").doc(uid).delete();
     
    } catch (ex) {
      window.alert(ex);
    }
  }


}
