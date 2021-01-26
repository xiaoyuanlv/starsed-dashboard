import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Deleteacc } from "src/app/models/deleteacc.model";
import { Member } from "src/app/models/member.model";
import { MemberService } from "src/app/shared/services/member.service";
import { AuthService } from "../../../shared/services/auth.service";

@Component({
  selector: "app-header-stats",
  templateUrl: "./header-stats.component.html",
})
export class HeaderStatsComponent implements OnInit {
  member: Member = new Member();
  user;
  deletionAcc= null;

  constructor(
    public authService: AuthService,
    private router: Router,
    public memberService: MemberService
  ) {
   
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
    }

    this.CheckDeletionAcc();
  }

  
  
}
