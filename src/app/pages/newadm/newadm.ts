import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators, FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommunService } from 'src/app/commun.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-newadm',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './newadm.html',
  styleUrl: './newadm.css'
})
export class NewadmComponent implements OnInit {

  fgreg: FormGroup;
  ggroup!: FormGroup;
  sma!: FormGroup;
  g!: boolean;
  b!: boolean;
  // ageval: number[];
  rshow!: string;
  // lshow: FormControl;
  imgurl!: string;
  msg: any;
  tgp: string[];
  tgn: string[];

  constructor(private cover: CommunService, private fb: FormBuilder, private rout: Router) {


    this.tgp = ["A+", "B+", "AB+", "O+"];
    this.tgn = ["A-", "B-", "AB-", "O-"];
    this.fgreg = fb.group({
      rname: [null, Validators.required],
      adhr: [null, Validators.required],
      rdob: [null, Validators.required],
      rgen: [null, Validators.required],
      bldg: [null, Validators.required],
      rrel: [null, Validators.required],
      rcomm: [null, Validators.required],
      rsubcst: [null, Validators.required],
      rtongue: [null, Validators.required],
      rdgn: [null],
      rvsmp: [null, Validators.required],
      rfpag: [null, Validators.required],
      rfedu: [null, Validators.required],
      rfposition: [null, Validators.required],
      rmpag: [null, Validators.required],
      rmedu: [null, Validators.required],
      rmposition: [null, Validators.required],
      rpag: [null],
      anin: [null, Validators.required],
      raddr: [null, Validators.required],

      rphno: [null, Validators.compose([Validators.required, Validators.minLength(10), Validators.pattern('[0-9]+'),
      Validators.maxLength(10)])],
      remail: [null, Validators.required],
      rcs: [null, Validators.required],
      rlsn: [null, Validators.required],
      
      rncs: [null, Validators.required],
      rsma: [null, Validators.required],
      rdec: [null, Validators.required],
    });

  }

  csd() {
    // this.b='O+';this.g='Mal';
    this.tgp = ["A+", "B+", "AB+", "O+"];
    this.tgn = ["A-", "B-", "AB-", "O-"];
    // this.b=false;this.g=false;
  }

  fgrcheck: any = {
    rname: { required: "Please Enter your Name." },
    adhr: { required: "Please Enter Aadhaar NO" },
    rdob: { required: "Please Enter Date of Birth.", dob: "Please Enter Valid Date" },
    rgen: { required: "Please Choose Your Gender." },
    bldg: { required: "Please Choose Your Blood Group." },
    rrel: { required: "Please Enter Religion.", },
    rcomm: { required: "Please Enter Community.", },
    rsubcast: { required: "Please Enter Sub Caste.", },
    rtongue: { required: "Please Enter Mother Tongue.", },
    rdgn: { required: "Please Enter Disability Group Name.", },
    rvsmp: { required: "Please fill Yes or No Vaccinated for Small Pox or not.", },
    rfpag: {
      required: "Please Enter The Father Name ",
    },
    rfedu: { required: "Please Enter The Father Education " },
    rfposition: { required: "Please Enter Father's Occupation" },
    rmpag: {
      required: "Please Enter The Mother Name ",
    },
    rmedu: { required: "Please Enter The Mother Education " },
    rmposition: { required: "Please Enter Mother's Occupation" },
    rpag: {
      required: "Please Enter The Guardian Name ",
    },
    anin: { required: "Please Enter Annual Income" },
    raddr: { required: "Please Enter your Address" },
    // rposition: { required: "Please Enter Occupation of Parent/Guardian" },
    rphno: {
      required: "Please Enter your Phone no", minlength: "Please Enter Valid Phone no",
      maxlength: "Please Enter Valid Phone no", pattern: "Please Enter Valid Phone No",
    },
    rcs: { required: "Please Enter Last Studied Class ex:1st standard" },
    remail: { required: "Please Enter your EmailID" },
    rlsn: { required: "Please Enter Last Studied School Name" },
    rncs: { required: "Please Enter Proposal of New Class ex: 5" },
    rdec: { required: "Please Accept (tick) the Declaration" },
    rsma: { required: "Please Choose Smartphone question" },

  }

  ngOnInit() {

    this.g = false;
    this.msg = "dlskfj";
    this.csd();

    // this.vds="showdialog";
  }
  genp(valu: string, ev: any) {
    if (valu != undefined)
    this.fgreg.patchValue({ "rgen": valu })
  }
  trf(valu: string, ev: any) {
    if (valu != undefined)
    this.fgreg.patchValue({ "rsma": valu })
  }
  dec(valu: string, ev: any) {
    if (valu != undefined)
    this.fgreg.patchValue({ "rdec": valu })
  }

  bg(valu: string, ev: any) {
    if (valu != undefined)
      this.fgreg.patchValue({ "bldg": valu });
  }



  vds: any;

  newadm() {
    var d;
    console.log(this.fgreg);
    if (this.fgreg.status == "INVALID" || this.fgreg.status == "PENDING") {
      d = this.cover.checking(this.fgreg, this.fgrcheck);
      this.vds = "showdialog"
      this.msg = d;

      // alert(d);
      // this.vds="showdialog";
    }
    else {
      this.vds = "showdialog";
      this.cover.nsadm(this.fgreg.value).subscribe(
        (res: any) => {
          console.log("res", res);
          res = res.trimLeft(); res = res.trimRight();
          if (res == 'inserted') {
            this.vds = "showdialog";
            this.msg = "Application Received, We will call you back later."
          }
          else if (res == 'Already exist User') {
            this.vds = "showdialog";
            this.msg = res;
          }
          else {
            this.vds = "showdialog";
            this.msg = "Some Data Missing";
          }
        }
      )


      setTimeout(() => {
        this.g = true;
      }, 200);
      setTimeout(() => {
        this.g = false;
      }, 500);
      this.fgreg.reset();

    }
  }


}
