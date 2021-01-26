import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Member } from "src/app/models/member.model";
import { MemberService } from "src/app/shared/services/member.service";
import { AuthService } from "../../../shared/services/auth.service";
import { Creativestar } from "src/app/models/creativestar.model";
import { CreativestarService } from "src/app/shared/services/creativestar.service";
import { DocumentChangeAction } from "@angular/fire/firestore";

@Component({
  selector: "app-creativestar",
  templateUrl: "./creativestar.component.html",
  styleUrls: ["./creativestar.component.css"],
})
export class CreativestarComponent implements OnInit {

  starArr: Array<Creativestar> = [];

  CreativeStar: Creativestar = new Creativestar();
  user;
  member;
  CreativeStarForm;

  color = "light";

  starpgnum = 1;

  firstOne;
  lastVisible;

  showModal = false;
  showCreativeStar = true;
  showform = false;

  selectedCreativeStar: Creativestar = null;
  stardata: DocumentChangeAction<unknown>[] = [];

  totallimit = 31;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    public memberService: MemberService,
    public starService: CreativestarService
  ) {
    this.CreativeStarForm = this.formBuilder.group({
      email: ["", [Validators.required]],
      author: ["", [Validators.required]],
      browseurl: ["", [Validators.required]],
      color: ["", [Validators.required]],
      photoURL: ["", [Validators.required]],
      title: ["", [Validators.required]],
      description: ["", [Validators.required]],
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
  }

  ReadCreativeStar(selectedCreativeStar: Creativestar) {
    this.showModal = true;
    this.showCreativeStar = false;
    this.showform = false;
    this.selectedCreativeStar = selectedCreativeStar;
  }

  editCreativeStar(selectedCreativeStar: Creativestar) {
    this.showModal = false;
    this.showCreativeStar = false;
    this.showform = true;
    this.CreativeStar = selectedCreativeStar;
  }

  CloseCreativeStar() {
    this.showCreativeStar = true;
    this.showform = false;
    this.showModal = false;
    this.selectedCreativeStar = null;
  }

  ShowNewForm() {
    this.lastVisible = null;
    this.firstOne = null;
    this.showform = true;
    this.showCreativeStar = false;
    this.showModal = false;
    this.starpgnum = 0;

    this.CreativeStar = new Creativestar();
    this.CreativeStar.email = this.member.email;
    this.CreativeStar.author = this.member.displayName;
  }

  ShowCreativeStar() {
    this.showform = false;
    this.showModal = false;
    this.showCreativeStar = true;
    this.starpgnum = 0;
    this.CreativeStar = null;
    this.starArr = [];
    this.stardata = [];

    this.starService.GetData(this.user.uid).subscribe((data) => {
      if (data.length > 0) {
        this.starpgnum += 1;

        this.lastVisible = data[data.length - 1].payload.doc;
        this.firstOne = data[0].payload.doc;

        this.stardata = data;

        this.starArr = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as Object),
          } as Creativestar;
        });

      }
    });
  }

  getMemberInfo(id) {
    this.memberService.getInfo(id).subscribe((res) => {
      this.member = res.data() as Member;
      this.CreativeStar = new Creativestar();
      this.CreativeStar.email = this.member.email;
      this.CreativeStar.author = this.member.displayName;

      this.ShowCreativeStar();
    });
  }

  ShowPhotoURL(stardata) {
    this.CreativeStar.photoURL = stardata.photoURL;
  }

  onSubmit(stardata) {
    if (confirm("Save?")) {
      try {
        var savingdata = {
          photoURL: stardata.photoURL,
          title: stardata.title,
          description: stardata.description,
          author: stardata.author,
          email: stardata.email,
          createdDate:  new Date(),
          browseurl: stardata.browseurl,
          color: stardata.color,
          uid: this.user.uid
        };

        if (this.CreativeStar.id != null) {
          this.starService.UpdateData(
            savingdata,
            this.CreativeStar.id
          );
        } else {
          this.starService.CreateNewData(savingdata);
        }

        this.CreativeStarForm.reset();
        this.CreativeStar = null;

        this.ShowCreativeStar();
      } catch (ex) {
        window.alert(ex);
      }
    }
  }

  deleteCreativeStar(selectedCreativeStar, index) {
    if (
      confirm(
        'Are you sure to delete " ' +
          selectedCreativeStar.title +
          ' " There is no trun back ...'
      )
    ) {
      this.starService.DeleteData(selectedCreativeStar.id);
      this.starArr.splice(index, 1);
      this.stardata.splice(index, 1);

      if (this.starArr.length > 0) {
        this.firstOne = this.stardata[0].payload.doc;
        this.lastVisible = this.stardata[this.stardata.length - 1].payload.doc;
      } else {
        this.ShowCreativeStar();
      }
    }
  }

}
