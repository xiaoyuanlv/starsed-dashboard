import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Vorganization } from "src/app/models/vorganization.model";
import { VolunteerService } from "src/app/shared/services/volunteer.service";
import { MemberService } from "src/app/shared/services/member.service";
import { AuthService } from "../../../shared/services/auth.service";
import { Vcause } from "src/app/models/vcause.model";
import { DocumentChangeAction } from "@angular/fire/firestore";
import { Member } from "src/app/models/member.model";

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit {

  starArr: Array<Vorganization> = [];
  causesArr: Array<Vcause> = [];

  Vorganization: Vorganization = new Vorganization();
  user;
  member;
  VorganizationForm;

  color = "light";

  firstOne;
  lastVisible;

  showModal = false;
  showVorganization = true;
  showform = false;

  selectedVorganization: Vorganization = null;
  selectedCausesArr = [];
  stardata: DocumentChangeAction<unknown>[] = [];

  totallimit = 5;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    public memberService: MemberService,
    public volunteerService: VolunteerService
  ) {
    this.VorganizationForm = this.formBuilder.group({
      title: ["", [Validators.required]],
      mission: ["", [Validators.required]],
      causes: "",
      found: ["", [Validators.required]],
      location: ["", [Validators.required]],
      mapURL: ["", [Validators.required]],
      photoURL: ["", [Validators.required]],
      webURL: ["", [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(["auth"]);
    }

    if (this.authService.isLoggedIn) {
      this.user = JSON.parse(localStorage.getItem("user") as string);
      this.getMemberInfo(this.user.uid);
    }

    this.GetCausesData();
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
      } 
    });
  }

  

  ReadVorganization(selectedVorganization: Vorganization) {
    this.showModal = true;
    this.showVorganization = false;
    this.showform = false;
    
    selectedVorganization.causes.forEach(element => {
      this.selectedCausesArr.push(... this.causesArr.filter((v, index, arr) => {
        return (v.id == element);
      }));
    });
    
    this.selectedVorganization = selectedVorganization;
  }

  editVorganization(selectedVorganization: Vorganization) {
    this.showModal = false;
    this.showVorganization = false;
    this.showform = true;
    this.Vorganization = selectedVorganization;
  }

  CloseVorganization() {
    this.showVorganization = true;
    this.showform = false;
    this.showModal = false;
    this.selectedVorganization = null;
  }

  ShowNewForm() {
    this.lastVisible = null;
    this.firstOne = null;
    this.showform = true;
    this.showVorganization = false;
    this.showModal = false;

    this.Vorganization = new Vorganization();
    this.Vorganization.uid = this.member.uid;
  }

  showVorganizationList() {
    this.showform = false;
    this.showModal = false;
    this.showVorganization = true;
    this.Vorganization = null;
    this.starArr = [];
    this.stardata = [];
    this.selectedCausesArr = [];

    this.volunteerService.GetVOrganizationByUser(this.user.uid).subscribe((data) => {
      if (data.length > 0) {

        this.lastVisible = data[data.length - 1].payload.doc;
        this.firstOne = data[0].payload.doc;

        this.stardata = data;

        this.starArr = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as Object),
          } as Vorganization;
        });
      } 
    });


  }


  getMemberInfo(id) {
    this.memberService.getInfo(id).subscribe((res) => {
      this.member = res.data() as Member;
      this.Vorganization = new Vorganization();
      this.Vorganization.uid = this.member.uid;

      this.showVorganizationList();
    });
  }

  ShowPhoto(starData) {
    this.Vorganization.photoURL = starData.photoURL;
  }

  onSubmit(stardata) {
    if (confirm("Save?")) {
      try {
        var savingdata = {
          title: stardata.title,
          mission: stardata.mission,
          causes: stardata.causes,
          found: stardata.found,
          location: stardata.location,
          mapURL: stardata.mapURL,
          photoURL: stardata.photoURL,
          webURL: stardata.webURL,
          createdDate:  new Date(),
          uid: this.user.uid
        };

       // alert('SUCCESS!! \n\n' + JSON.stringify(savingdata, null, 4));

        if (this.Vorganization.id != null) {
          this.volunteerService.UpdateVOrganizationData(
            savingdata,
            this.Vorganization.id
          );
        } else {
          this.volunteerService.CreateNewVOrganizationData(savingdata);
        }

        this.VorganizationForm.reset();
        this.Vorganization = null;

        this.showVorganizationList();
      } catch (ex) {
        window.alert(ex);
      }
    }
  }

  deleteVorganization(selectedVorganization, index) {
    if (
      confirm(
        'Are you sure to delete " ' +
          selectedVorganization.title +
          ' " There is no trun back ...'
      )
    ) {
      this.volunteerService.DeleteVOrganizationData(selectedVorganization.id);
      this.starArr.splice(index, 1);
      this.stardata.splice(index, 1);

      if (this.starArr.length > 0) {
        this.firstOne = this.stardata[0].payload.doc;
        this.lastVisible = this.stardata[this.stardata.length - 1].payload.doc;
      } else {
        this.showVorganizationList();
      }
    }
  }

}
