import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { VolunteerService } from "src/app/shared/services/volunteer.service";
import { MemberService } from "src/app/shared/services/member.service";
import { AuthService } from "../../../shared/services/auth.service";
import { Vcause } from "src/app/models/vcause.model";
import { DocumentChangeAction } from "@angular/fire/firestore";
import { Member } from "src/app/models/member.model";
import { Vorganization } from "src/app/models/vorganization.model";
import { VOpportunity } from "src/app/models/vopportunity.model";

@Component({
  selector: 'app-volunteer',
  templateUrl: './volunteer.component.html',
  styleUrls: ['./volunteer.component.css']
})
export class VolunteerComponent implements OnInit {

  starArr: Array<VOpportunity>;
  causesArr: Array<Vcause>;
  causesArr2: Array<Vcause>;
  organizationArr: Array<Vorganization>;

  VOpportunity: VOpportunity = new VOpportunity();
  user;
  member;
  VOpportunityForm;

  color = "light";

  firstOne;
  lastVisible;

  showModal = false;
  showVOpportunity = true;
  showform = false;

  selectedVOrganization: Vorganization[] = null;
  selectedVOpportunity: VOpportunity = null;
  selectedCause : Vcause[] = null;
  stardata: DocumentChangeAction<unknown>[] = [];

  selectedCauseID = "";

  totallimit = 5;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    public memberService: MemberService,
    public volunteerService: VolunteerService
  ) {
    this.VOpportunityForm = this.formBuilder.group({
      title: ["", [Validators.required]],
      description: ["", [Validators.required]],
      starcolor: "",
      isflexible: "",
      fromdate: "",
      todate: "",
      isvirtual: "",
      causeid: "",
      city: "",
      country: "",
      location: "",
      organizationid: "",
      requiredskill: "",
      photoURL: ""
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.user = JSON.parse(localStorage.getItem("user") as string);
      this.getMemberInfo(this.user.uid);
    } else {
      this.router.navigate(["auth"]);
    }
  }

  GetCausesData() {
    this.volunteerService.GetAllCausesData().subscribe((data) => {
      if (data.length > 0) {
        this.causesArr = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as Object),
          } as Vcause;
        });


        this.causesArr2 = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as Object),
          } as Vcause;
        });

        this.selectedCauseID = this.causesArr[0].id;
        this.showVOpportunityList();
      } 
    });
  }


  GetOrganizationData(uid) {
    this.volunteerService.GetVOrganizationByUser(uid).subscribe((data) => {
      if (data.length > 0) {
        this.organizationArr = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as Object),
          } as Vorganization;
        });
      } 
    });
  }

  ReadVOpportunity(selectedVOpportunity: VOpportunity) {
    this.showModal = true;
    this.showVOpportunity = false;
    this.showform = false;

    this.selectedVOpportunity = selectedVOpportunity;
   
    this.selectedCause = this.causesArr.filter((v, index, arr) => {
        return (v.id == this.selectedVOpportunity.causeid);
    });

    this.selectedVOrganization = this.organizationArr.filter((v, index, arr) => {
      return (v.id == this.selectedVOpportunity.organizationid);
    });
    
   
  }

  editVOpportunity(selectedVOpportunity: VOpportunity) {
    this.showModal = false;
    this.showVOpportunity = false;
    this.showform = true;
    this.VOpportunity = selectedVOpportunity;
  }

  CloseVOpportunity() {
    this.showVOpportunity = true;
    this.showform = false;
    this.showModal = false;
    this.selectedVOpportunity = null;
    this.selectedVOrganization = [];
    this.selectedCause = [];
  }

  ShowNewForm() {
    this.lastVisible = null;
    this.firstOne = null;
    this.showform = true;
    this.showVOpportunity = false;
    this.showModal = false;

    this.VOpportunity = new VOpportunity();
    this.VOpportunity.uid = this.member.uid;
  }


  ShowByCauseID(id){
    this.selectedCauseID = id;
    this.showVOpportunityList();
  }

  showVOpportunityList() {
    this.showform = false;
    this.showModal = false;
    this.showVOpportunity = true;
    this.VOpportunity = null;
    this.starArr = [];
    this.stardata = [];
    this.selectedCause = [];
    this.selectedVOrganization = [];

    this.volunteerService.GetVolunteerOpportunityByUser(this.selectedCauseID,this.user.uid).subscribe((data) => {
      if (data.length > 0) {
        this.starArr = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as Object),
          } as VOpportunity;
        });
      } 
     
    });
  }


  getMemberInfo(id) {
    this.memberService.getInfo(id).subscribe((res) => {
      this.member = res.data() as Member;
      this.VOpportunity = new VOpportunity();
      this.VOpportunity.uid = this.member.uid;
     
      this.GetCausesData();
      this.GetOrganizationData(this.member.uid);
    });
  }

  ShowPhoto(starData) {
    this.VOpportunity.photoURL = starData.photoURL;
  }

  onSubmit(stardata) {
    if (confirm("Save?")) {
      try {
        var savingdata = {
          title: stardata.title,
          starcolor: stardata.starcolor,
          requiredskill: stardata.requiredskill,
          isflexible:  stardata.isflexible,
          causeid:  stardata.causeid,
          organizationid: stardata.organizationid,
          location: stardata.location,
          isvirtual:  stardata.isvirtual,
          description: stardata.description,
          city:  stardata.city,
          country: stardata.country,
          fromdate:  stardata.fromdate,
          todate: stardata.todate,
          photoURL: stardata.photoURL,
          createdDate: new Date(),
          uid: this.user.uid
        };

       // alert('SUCCESS!! \n\n' + JSON.stringify(savingdata, null, 4));

        if (this.VOpportunity.id != null) {
          this.volunteerService.DeleteVolunteerOpportunityData(this.selectedCauseID,  this.VOpportunity.id);
          this.volunteerService.CreateNewVolunteerOpportunityData(savingdata, stardata.causeid);
        } else {
          this.volunteerService.CreateNewVolunteerOpportunityData(savingdata, stardata.causeid);
        }

        this.VOpportunityForm.reset();
        this.VOpportunity = null;

        this.selectedCauseID = stardata.causeid;
        this.showVOpportunityList();

      } catch (ex) {
        window.alert(ex);
      }
    }
  }

  deleteVOpportunity(selectedVOpportunity, index) {
    if (
      confirm(
        'Are you sure to delete " ' +
          selectedVOpportunity.title +
          ' " There is no trun back ...'
      )
    ) {
      this.volunteerService.DeleteVolunteerOpportunityData(selectedVOpportunity.causeid, selectedVOpportunity.id);

      this.showVOpportunityList();
      
    }
  }

}
