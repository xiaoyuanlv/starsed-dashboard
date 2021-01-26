import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import { Letter } from "src/app/models/letter.model";
import { User } from "src/app/shared/services/user";
import { AuthService } from '../../shared/services/auth.service';
import { LetterService } from '../../shared/services/letter.service';

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
})
export class SidebarComponent implements OnInit {
  collapseShow = "hidden";
  totalUnreadLetter = 0;
  user: User;
  constructor(public authService: AuthService, public letterService: LetterService, private router: Router) {}

  ngOnInit() {
    if(this.authService.isLoggedIn) {
      this.user = JSON.parse(localStorage.getItem("user") as string);
      this.letterService.GetUnreadReceivedLetter(this.user.email).subscribe((v) => {
        this.totalUnreadLetter = v.size;
      });
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
  
  toggleCollapseShow(classes) {
    this.collapseShow = classes;
  }

  Logout() {
    this.authService.SignOut();
  }

}
