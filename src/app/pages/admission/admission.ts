import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommunService } from 'src/app/commun.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-adm',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admission.html',
  styleUrl: './admission.css'
})
export class AdmComponent implements OnInit {

  dstr!: any[];
  bd: any;
  rr: any;
  fgret: FormGroup;
  g!: boolean;
  constructor(private serving: CommunService, private http: HttpClient, private fb: FormBuilder, private rout: Router) {
    this.fgret = fb.group({
      dstr: [null, Validators.required],
    });
  }

  fgrcheck: any = {
    dstr: { required: "Please Mention Date" },
  };

  ngOnInit() {
    if (localStorage.getItem("iid") == null) {
      (async () => {
        // await delay(5000);
        // this.rout.navigate(["/"])
      })();
    }
    this.alret("all");
  }

  ag(vale: string) {
    if (vale == 'today') {
      this.fgret.patchValue({ "dstr": formatDate(Date.now(), "yyyy/MM/dd", "en") })
      this.alret('specific');
      setTimeout(() => {        
        this.fgret.reset();
      }, 1000);
      // console.log("printed");

    } else if (vale == 'specific') {
      this.ret();
      setTimeout(() => {
        this.g = true;
      }, 200);
      setTimeout(() => {
        this.g = false;
      }, 500);
    } else {
      this.alret("allot");
    }
  }

  ret() {
    if (this.fgret.status == "INVALID" || this.fgret.status == "PENDING") {
      var d = this.serving.checking(this.fgret, this.fgrcheck);
      alert(d);
    }
    else {
      this.alret("specific");
    }

    // 
  }
  logout() {
    this.serving.logcheckout(localStorage.getItem('iid')).subscribe(
      (res: any) => { });
    localStorage.clear()
    this.rout.navigate(["/admsign"]);

  }
  sign(valu: string, valu1: string) {

    if (valu == 'alloted') {
      console.log(valu, valu1)
      this.serving.reqcheckout(valu1).subscribe(
        (res: any) => { });
      localStorage.clear()
      this.rout.navigate(["/admret"]);
    } else {
      this.serving.reqremove(valu1).subscribe(
        (res: any) => { });
      localStorage.clear()
      this.rout.navigate(["/admret"]);
    }

  }
  alret(sendr: string) {
    if (sendr === 'specific' && (!this.fgret.value || !this.fgret.value.dstr)) {
      console.log('Skipping specific query because dstr is empty');
      return;
    }
    console.log('alret sendr:', sendr, 'fgret value:', this.fgret.value);
    this.serving.aret(this.fgret.value, sendr).subscribe(
      (res: any) => {
        console.log('alret res raw:', res);
        res = res.trimLeft(); res = res.trimRight();
        if (!res) {
          console.log('alret res is empty');
          this.rr = [];
        }
        else {
          console.log('alret res parsing JSON:', res);
          try {
            this.rr = JSON.parse(res).br;
            console.log('alret rr parsed successfully:', this.rr);
          } catch (e) {
            console.error('alret JSON parse error:', e);
            this.rr = [];
          }
        }
      },
      (err: any) => {
        console.error('alret HTTP error:', err);
      });
  }

  logRR() {
    console.log('Template RR state:', this.rr);
    return '';
  }

}
