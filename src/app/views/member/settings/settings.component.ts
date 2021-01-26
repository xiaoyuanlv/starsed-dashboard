import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Deleteacc } from "src/app/models/deleteacc.model";
import { Member } from "src/app/models/member.model";
import { MemberService } from "src/app/shared/services/member.service";
import { AuthService } from "../../../shared/services/auth.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
})
export class SettingsComponent implements OnInit {
  member: Member = new Member();
  user;
  profileForm;
  deletionAcc= null;

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    public memberService: MemberService
  ) {
    this.profileForm = this.formBuilder.group({
      oldpassword: "",
      nwpassword: "",
    });
  }

  ngOnInit() {
    if (this.authService.isLoggedIn) {
      this.user = JSON.parse(localStorage.getItem("user") as string);
      this.getMemberInfo(this.user.uid);
    } else {
      this.router.navigate(["auth"]);
    }
  }

  getMemberInfo(id) {
    this.memberService.getInfo(id).subscribe((res) => {
      this.member = res.data() as Member;
      this.CheckDeletionAcc();
    });
  }

  get f() {
    return this.profileForm.controls;
  }

  onSubmit(profileData) {
    try {
      if (profileData.oldpassword == "" || profileData.nwpassword == "") {
        window.alert("Please fill in all the fields");
        return;
      } else {
        this.authService.ChangePassword(this.user.email, profileData.oldpassword, profileData.nwpassword);
        this.profileForm.reset();
      }
    } catch (ex) {
      window.alert(ex);
    }
  }

  CheckDeletionAcc() {
    this.memberService.checkDeleteAccOrNot(this.user.uid).subscribe((res) => {
      if(res.data() != null) {
        this.deletionAcc = res.data() as Deleteacc;
      } else {
        this.deletionAcc = null;
      }
    });
  }

  CancelDeletionAcc() {
    if(this.deletionAcc != null) {
      this.memberService.cancelDeletion(this.user.uid);
      this.CheckDeletionAcc();
    }
  }

  DeleteAcc() {
    // var deleteDate : Date = new Date();
    // deleteDate.setDate(deleteDate.getDate() + 31);
    
    if(confirm("Are you sure? Your acc will be deleted permanently. There is no turning back.")) {
      // this.memberService.scheduleDeletion({
      //   uid: this.user.uid,
      //   mdate: deleteDate,
      // }, this.user.uid)

      // this.CheckDeletionAcc();

      this.authService.DeleteAcc();
    }

   
  }
  
}
