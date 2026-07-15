import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate, DatePipe } from '@angular/common';
import { Validators, FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommunService } from 'src/app/commun.service';

@Component({
  selector: 'app-exiadm',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './results.html',
  styleUrl: './results.css'
})
export class ExiadmComponent implements OnInit {

  fglog: FormGroup;
  bp: any;
  dt!: string[];
  i: any;
  msg: any;
  vds: any;
  ddb!: Date;
  ex = false; lg = true;

  constructor(private cover: CommunService, private fb: FormBuilder, private rout: Router, private http: HttpClient) {
    this.fglog = fb.group({
      lnum: [null, Validators.compose([Validators.minLength(10), Validators.maxLength(10),
      Validators.required, Validators.pattern('[0-9]+'),])],
      ldob: [null, Validators.compose([Validators.required,])],
    });

  }
  fglogcheck: any = {
    lnum: {
      // required: "Please Enter your Phone no", minlength: "Please Enter Valid Phone no",
      // maxlength: "Please Enter Valid Phone no", pattern: "Please Enter Valid Phone No",
      required: "தங்களது அலைபேசி எண் பதிவு செய்யவும்", minlength: "தங்களது 10 இலக்கு அலைபேசி எண்களை பதிவு செய்யவும்",
      maxlength: "தங்களது 10 இலக்கு அலைபேசி எண்களை பதிவு செய்யவும்", pattern: "தங்களது 10 இலக்கு அலைபேசி எண்களை பதிவு செய்யவும்",
    },
    ldob: {
      // required: "Please Enter Date of Birth.", pattern: "Please Enter Valid Date" 
      required: "தங்களது மகன்/மகள் பிறந்த தேதியை குறிப்பிடவும்",
      pattern: "தங்களது மகன்/மகள் பிறந்த தேதியை வருடம்-மாதம்-தேதி என்ற வரிசையில் குறிப்பிடவும்"
    },
  }


  ngOnInit() {

    
    // .subscribe((res: any) => {
    //   console.log("res", res)
    // });
  }
  // search() {
  //   this.drawing = [];
  //   this.dt = [];
  //   this.http.get("/assets/img/oladdress.txt", { responseType: 'text' as 'json' }).subscribe((res: any) => {
  //     this.dt = res.split("^^");
  //     console.log(this.dt.length, this.dt);
  //     for (this.i = 0; this.i < this.dt.length; this.i++) {
  //       // (this.dt[this.i]).trimLeft(); (this.dt[this.i]).trimRight();
  //       this.drawing.push(JSON.parse(this.dt[this.i]));
  //     }
  //   });
  // }
  converdate(value: any): string {
    var dap = new DatePipe("en-US");
    return dap.transform(value, 'yyyy-MM-dd') || '';
  }

  open() {
    if (this.fglog.status == "INVALID" || this.fglog.status == "PENDING") {
      
      this.vds = "showdialog";
      this.msg = this.cover.checking(this.fglog, this.fglogcheck);
      setTimeout(() => {
      this.vds = "show";
      }, 2000);
    }
    else {
      
      // console.log("acdate", this.fglog.controls.ldob.value);
      this.fglog.patchValue({ ldob: this.converdate(this.fglog.controls['ldob'].value) });
      // console.log("convdate", this.fglog.controls.ldob.value);
      this.cover.exstu(this.fglog.value).subscribe(
        (res: any) => {
          // console.log("res", res);
          if (res == "  ") {
            // this.vds = "showdialog";
            // this.msg = "Please check your no and call the school 0452-2482907 "
            // alert("Please check your no and call the school 0452-2482907 ")
            alert("தங்களது அலைபேசி எண் சரிப்பார்கவும் அல்லது பள்ளியை தொடர்பு கொள்ளவும் \n 0452-2482907 ")
            // setTimeout(() => {
            //   this.vds = "show";
            //   }, 2000);

          }
          else {
            // this.vds = "show"
            this.bp = JSON.parse(res);
            // console.log("bp", this.bp);
            this.sign();
          }
        });
    }
  }

  updat() {
    this.vds = "showdialog";
    this.cover.updt(this.fglog.value).subscribe(
      (res: any) => {
        console.log("res", res);
        res = res.trimLeft(); res = res.trimRight();
        if (res == "updated") {
          // this.vds = "showdialog";
          // alert("Thank")
          // this.msg = "Thank You";
          this.msg="நன்றி, வரும் வாரங்களில் பள்ளி திறப்பு தேதி அறிவிக்கபடும் என்பதை அன்புடன் தெரிவித்துக் கொள்கிறோம்.";
        }
      });
  }

  sign() {
    this.ex = true;
    this.lg = false;
  }


}
