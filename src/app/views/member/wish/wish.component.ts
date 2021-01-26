import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Member } from "src/app/models/member.model";
import { MemberService } from "src/app/shared/services/member.service";
import { AuthService } from "../../../shared/services/auth.service";
import { Wish } from "src/app/models/wish.model";
import { WishService } from "src/app/shared/services/wish.service";
import { DocumentChangeAction } from "@angular/fire/firestore";

@Component({
  selector: 'app-wish',
  templateUrl: './wish.component.html',
  styleUrls: ['./wish.component.css']
})
export class WishComponent implements OnInit {

  starArr: Array<Wish> = [];

  Wish: Wish = new Wish();
  user;
  member;
  WishForm;

  color = "light";

  starpgnum = 1;

  firstOne;
  lastVisible;

  showModal = false;
  showWish = true;
  showform = false;

  selectedWish: Wish = null;
  stardata: DocumentChangeAction<unknown>[] = [];

  totallimit = 31;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    public memberService: MemberService,
    public starService: WishService
  ) {
    this.WishForm = this.formBuilder.group({
      email: ["", [Validators.required]],
      author: ["", [Validators.required]],
      fulfilled: false,
      title: ["", [Validators.required]],
      message: ["", [Validators.required]],
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

  ReadWish(selectedWish: Wish) {
    this.showModal = true;
    this.showWish = false;
    this.showform = false;
    this.selectedWish = selectedWish;
  }

  editWish(selectedWish: Wish) {
    this.showModal = false;
    this.showWish = false;
    this.showform = true;
    this.Wish = selectedWish;
  }

  CloseWish() {
    this.showWish = true;
    this.showform = false;
    this.showModal = false;
    this.selectedWish = null;
  }

  ShowNewForm() {
    this.lastVisible = null;
    this.firstOne = null;
    this.showform = true;
    this.showWish = false;
    this.showModal = false;
    this.starpgnum = 0;

    this.Wish = new Wish();
    this.Wish.email = this.member.email;
    this.Wish.author = this.member.displayName;
  }

  showWishList() {
    this.showform = false;
    this.showModal = false;
    this.showWish = true;
    this.starpgnum = 0;
    this.Wish = null;
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
          } as Wish;
        });
      } 
    });
  }


  getMemberInfo(id) {
    this.memberService.getInfo(id).subscribe((res) => {
      this.member = res.data() as Member;
      this.Wish = new Wish();
      this.Wish.email = this.member.email;
      this.Wish.author = this.member.displayName;

      this.showWishList();
    });
  }


  onSubmit(stardata) {
    if (confirm("Save?")) {
      try {
        var savingdata = {
          title: stardata.title,
          message: stardata.message,
          fulfilled: stardata.fulfilled,
          author: this.user.displayName,
          email: this.user.email,
          createdDate:  new Date(),
          uid: this.user.uid
        };

       // alert('SUCCESS!! \n\n' + JSON.stringify(savingdata, null, 4));

        if (this.Wish.id != null) {
          this.starService.UpdateData(
            savingdata,
            this.Wish.id
          );
        } else {
          this.starService.CreateNewData(savingdata);
        }

        this.WishForm.reset();
        this.Wish = null;

        this.showWishList();
      } catch (ex) {
        window.alert(ex);
      }
    }
  }

  deleteWish(selectedWish, index) {
    if (
      confirm(
        'Are you sure to delete " ' +
          selectedWish.title +
          ' " There is no trun back ...'
      )
    ) {
      this.starService.DeleteData(selectedWish.id);
      this.starArr.splice(index, 1);
      this.stardata.splice(index, 1);

      if (this.starArr.length > 0) {
        this.firstOne = this.stardata[0].payload.doc;
        this.lastVisible = this.stardata[this.stardata.length - 1].payload.doc;
      } else {
        this.showWishList();
      }
    }
  }

}
