import { Component, OnInit } from "@angular/core";
import { Letterstamp } from "src/app/models/letterstamp.model";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Member } from "src/app/models/member.model";
import { MemberService } from "src/app/shared/services/member.service";
import { AuthService } from "../../../shared/services/auth.service";
import { Letter } from "src/app/models/letter.model";
import { LetterService } from "src/app/shared/services/letter.service";
import { DocumentChangeAction } from "@angular/fire/firestore";

@Component({
  selector: "app-letter",
  templateUrl: "./letter.component.html",
  styleUrls: ["./letter.component.css"],
})
export class LetterComponent implements OnInit {
  stampArr: Array<Letterstamp> = [];
  letterArr: Array<Letter> = [];

  isSentLetterList: boolean = true;

  letter: Letter = new Letter();
  user;
  member;
  letterForm;
  stamp_arr = [];
  selecteditem = null;

  color = "light";

  pgnum = 1;

  firstOne;
  lastVisible;

  showModal = false;
  showLetter = true;
  showform = false;

  selectedLetter: Letter;
  isreceiver = false;
  letterdata : DocumentChangeAction<unknown>[] = [];

  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    public memberService: MemberService,
    public letterService: LetterService
  ) {
    this.letterForm = this.formBuilder.group({
      fromEmail: ["", [Validators.required]],
      fromName: ["", [Validators.required]],
      toEmail: ["", [Validators.required]],
      toName: ["", [Validators.required]],
      stamp: ["", [Validators.required]],
      title: ["", [Validators.required]],
      message: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(["auth"]);
    }

    this.getStamp();

    if (this.authService.isLoggedIn) {
      this.user = JSON.parse(localStorage.getItem("user") as string);
      this.getMemberInfo(this.user.uid);
    }
  }

  ReadLetter(selectedLetter: Letter) {
    this.showModal = true;
    this.showLetter = false;
    this.showform = false;
    this.selectedLetter = selectedLetter;

    if (this.isreceiver) {
      var savingdata = {
        stamp: selectedLetter.stamp,
        fromEmail: selectedLetter.fromEmail,
        fromName: selectedLetter.fromName,
        toEmail: selectedLetter.toEmail,
        toName: selectedLetter.toName,
        title: selectedLetter.title,
        message: selectedLetter.message,
        senderuid: this.user.uid,
        readStatus: true,
        sentdate: selectedLetter.sentdate,
      };

      this.letterService.UpdateReceiverLetterRead(
        savingdata,
        this.user.email,
        this.selectedLetter.id
      );
    }
  }

  CloseLetter() {
    this.showLetter = true;
    this.showform = false;
    this.showModal = false;
    this.selectedLetter = null;
  }

  ShowNewForm() {
    this.lastVisible = null;
    this.firstOne = null;
    this.showform = true;
    this.showLetter = false;
    this.showModal = false;
    this.isSentLetterList = true;
    this.pgnum = 0;
  }

  ShowSentLetter() {
    this.showform = false;
    this.showModal = false;
    this.showLetter = true;
    this.isSentLetterList = true;
    this.pgnum = 0;
    this.isreceiver = false;
    this.letterArr = [];
    this.letterdata = [];

    this.letterService
      .GetSentLetter(this.user.uid, null, 25)
      .subscribe((data) => {
        if (data.length > 0) {
          this.pgnum += 1;

          this.lastVisible = data[data.length - 1].payload.doc;
          this.firstOne = data[0].payload.doc;

          this.letterdata = data;

          this.letterArr = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as Object),
            } as Letter;
          });
        }
      });
  }

  ShowReceivedLetter() {
    this.showform = false;
    this.showModal = false;
    this.showLetter = true;
    this.isSentLetterList = false;
    this.pgnum = 0;
    this.isreceiver = true;
    this.letterArr = [];
    this.letterdata = [];

    this.letterService
      .GetReceivedLetter(this.user.email, null, 25)
      .subscribe((data) => {
        if (data.length > 0) {
          this.pgnum += 1;

          this.lastVisible = data[data.length - 1].payload.doc;
          this.firstOne = data[0].payload.doc;

          this.letterdata = data;

          this.letterArr = data.map((e) => {
            return {
              id: e.payload.doc.id,
              ...(e.payload.doc.data() as Object),
            } as Letter;
          });
        }
      });
  }

  ShowNextLetterList() {
    this.letterArr = [];
    this.letterdata = [];
    
    if (this.isSentLetterList) {
      this.letterService
        .GetSentLetter(this.user.uid, this.lastVisible, 25)
        .subscribe((data) => {
          if (data.length > 0) {
            this.firstOne = data[0].payload.doc;
            this.lastVisible = data[data.length - 1].payload.doc;
            this.pgnum++;

            this.letterdata = data;

            this.letterArr = data.map((e) => {
              return {
                id: e.payload.doc.id,
                ...(e.payload.doc.data() as Object),
              } as Letter;
            });
          } else {
            this.ShowSentLetter();
          }
        });
    } else {
      this.letterService
        .GetReceivedLetter(this.user.email, this.lastVisible, 25)
        .subscribe((data) => {
          if (data.length > 0) {
            this.pgnum++;
            this.firstOne = data[0].payload.doc;
            this.lastVisible = data[data.length - 1].payload.doc;

            this.letterdata = data;

            this.letterArr = data.map((e) => {
              return {
                id: e.payload.doc.id,
                ...(e.payload.doc.data() as Object),
              } as Letter;
            });
          } else {
            this.ShowReceivedLetter();
          }
        });
    }
  }

  ShowPrevLetterList() {
    if (this.isSentLetterList) {
      this.ShowSentLetter();
    } else {
      this.ShowReceivedLetter();
    }
  }

  getStamp() {
    this.letterService.GetLetterStamp().subscribe((data) => {
      this.stampArr = data.map((e) => {
        return {
          id: e.payload.doc.id,
          ...(e.payload.doc.data() as Object),
        } as Letterstamp;
      });
    });
  }

  getMemberInfo(id) {
    this.memberService.getInfo(id).subscribe((res) => {
      this.member = res.data() as Member;
      this.letter = new Letter();
      this.letter.fromEmail = this.member.email;
      this.letter.fromName = this.member.displayName;

      this.ShowReceivedLetter();
    });
  }

  onSubmit(letterData) {
    if (confirm("Save? There is no editing the letter after saving ...")) {
      try {
        var savingdata = {
          stamp: letterData.stamp,
          fromEmail: letterData.fromEmail,
          fromName: letterData.fromName,
          toEmail: letterData.toEmail,
          toName: letterData.toName,
          title: letterData.title,
          message: letterData.message,
          senderuid: this.user.uid,
          readStatus: false,
          sentdate: new Date(),
        };

        this.letterService.SetReceiverLetter(savingdata, letterData.toEmail);
        this.letterService.SetSentLetter(savingdata, this.user.uid);

        this.letterForm.reset();
        this.selecteditem = null;

        this.ShowSentLetter();
      } catch (ex) {
        window.alert(ex);
      }
    }
  }

  deleteLetter(selectedLetter, index) {
    if (
      confirm(
        "Are you sure to delete \" " +
          selectedLetter.title +
          " \" There is no trun back ..."
      )
    ) {
      if (this.isreceiver) {
        this.letterService.DeleteReceivedLetter(
          this.user.email,
          selectedLetter.id
        );
        this.letterArr.splice(index, 1);
        this.letterdata.splice(index, 1);
      } else {
        this.letterService.DeleteSentLetter(this.user.uid, selectedLetter.id);
        this.letterArr.splice(index, 1);
        this.letterdata.splice(index, 1);
      }

      if(this.letterArr.length > 0) {
        this.firstOne =  this.letterdata[0].payload.doc;
        this.lastVisible =  this.letterdata[this.letterdata.length - 1].payload.doc;
      } else {
        if(this.isreceiver) {
          this.ShowReceivedLetter();
        } else {
          this.ShowSentLetter();
        }
      }
     

    }
  }
}
