import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Member } from "src/app/models/member.model";
import { MemberService } from "src/app/shared/services/member.service";
import { AuthService } from "../../../shared/services/auth.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent implements OnInit {
  member: Member = new Member();
  user;
  profileForm;
  avatar_arr = [
    "male",
    "female",
    "human",
    "identicon",
    "initial",
    "bottts",
    "avatarrrs",
    "jdenticon",
    "griday",
  ];

  star_arr = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces"
  ]

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    public memberService: MemberService
  ) {
    this.profileForm = this.formBuilder.group({
      displayName: "",
      email: "",
      city: "",
      country: "",
      about: "",
      username: "",
      avatar: "",
      photoURL: "",
      dob: "",
      skill: "",
      language: "",
      starsign: "",
      gender: "",
      religion: ""
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
    this.member = new Member(); 
    this.member.displayName = this.user.displayName;
    this.member.email = this.user.email;
    this.memberService.getInfo(id).subscribe((res) => {
      this.member = res.data() as Member;     
    });
  }


  get f() { return this.profileForm.controls; }

  onSubmit(profileData) {

    if (this.profileForm.invalid) {
      window.alert("Please fill in all the fields");
      return;
    } else {

      //alert('SUCCESS!! \n\n' + JSON.stringify(this.profileForm.value, null, 4));

      try {
        var savingdata = {
          uid: this.user.uid,
          displayName: profileData.displayName,
          email: profileData.email,
          emailVerified: this.user.emailVerified,
          photoURL: profileData.photoURL,
          username: profileData.username,
          avatar: profileData.avatar,
          city: profileData.city,
          country: profileData.country,
          about: profileData.about,
          dob: profileData.dob,
          skill: profileData.skill,
          language: profileData.language,
          starsign: profileData.starsign,
          gender: profileData.gender,
          religion: profileData.religion
        }; 
       
        this.user.displayName = profileData.displayName;
        this.user.photoURL = profileData.photoURL;
  
        this.authService.UpdateUserProfile(profileData.displayName, profileData.photoURL);
  
        this.memberService.setInfo(savingdata, this.user.uid);
  
      } catch (ex) {
        window.alert(ex);
      }

    }
  }

  showAvatar(profileData) {
    if (profileData.username != "" && profileData.avatar != "") {
      this.member.photoURL =
        "https://avatars.dicebear.com/api/" +
        profileData.avatar +
        "/" +
        profileData.username +
        ".svg";
    }
  }

  ApplyPhotoURL(profileData) {
    this.member.photoURL = profileData.photoURL;
  }

}
