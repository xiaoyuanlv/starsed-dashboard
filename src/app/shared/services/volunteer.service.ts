import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: "root",
})
export class VolunteerService {
  constructor(private firestore: AngularFirestore) {}

  GetAllCausesData() {
    return this.firestore
      .collection("causes", (ref) => ref.orderBy("title"))
      .snapshotChanges();
  }


  /****************  Volunteer Opportunity  *************/

  GetVolunteerOpportunityByCause(causeid, doc) {
    if (doc != null) {
      return this.firestore
        .collection("volunteer/" + causeid + "/opportunity", (ref) =>
          ref.orderBy("createdDate", "desc").startAfter(doc).limit(31)
        )
        .snapshotChanges();
    } else {
      return this.firestore
        .collection("volunteer/" + causeid + "/opportunity", (ref) =>
          ref.orderBy("createdDate", "desc").limit(31)
        )
        .snapshotChanges();
    }
  }

  GetVolunteerOpportunityByUser(causeid, uid) {
    return this.firestore
      .collection("volunteer/" + causeid + "/opportunity", (ref) =>
        ref.where("uid", "==", uid)
      )
      .snapshotChanges();
  }

  DeleteVolunteerOpportunityData(causeid, id) {
    this.firestore
      .collection("volunteer")
      .doc(causeid)
      .collection("opportunity")
      .doc(id)
      .delete();
  }

  UpdateVolunteerOpportunityData(data, causeid, id) {
    try {
      this.firestore
        .collection("volunteer")
        .doc(causeid)
        .collection("opportunity")
        .doc(id)
        .ref.set(data);
    } catch (ex) {
      window.alert(ex);
    }
  }

  CreateNewVolunteerOpportunityData(data, causeid) {
    try {
      this.firestore
        .collection("volunteer")
        .doc(causeid)
        .collection("opportunity")
        .add(data);
    } catch (ex) {
      window.alert(ex);
    }
  }

  /****************  Volunteer Organization  *************/

  CreateNewVOrganizationData(data) {
    try {
      this.firestore.collection("vorganization").add(data);
    } catch (ex) {
      window.alert(ex);
    }
  }

  GetVOrganizationByUser(uid) {
    return this.firestore
      .collection("vorganization", (ref) => ref.where("uid", "==", uid))
      .snapshotChanges();
  }

  DeleteVOrganizationData(id) {
    this.firestore.collection("vorganization").doc(id).delete();
  }

  UpdateVOrganizationData(data, id) {
    try {
      this.firestore.collection("vorganization").doc(id).ref.set(data);
    } catch (ex) {
      window.alert(ex);
    }
  }



}
