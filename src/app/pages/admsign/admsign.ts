import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommunService } from 'src/app/commun.service';


@Component({
  selector: 'app-admsign',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admsign.html',
  styleUrl: './admsign.css'
})
export class AdmsignComponent implements OnInit {

  fglog: FormGroup;
  lshow!: any;

  constructor(private cover: CommunService, private fb: FormBuilder, private rout: Router) {

    this.fglog = fb.group({
      lemail: [null, Validators.required],
      lpass: [null, Validators.required]
    });
  }

  ngOnInit() {
  }
  fglcheck: any = {
    lemail: { required: "Please Enter Credential Name" },
    lpass: { required: "Please Enter Password" }
  }

  sign() {
    var d;
    if (this.fglog.status == "INVALID" || this.fglog.status == "PENDING") {
      d = this.cover.checking(this.fglog, this.fglcheck);
      this.lshow = d;
    }
    else {
      this.cover.logcheckin(this.fglog.value).subscribe(
        (res: any) => {
          console.log("res", res);
          res = res.trimLeft(); res = res.trimRight();
          var vs = res.split(",");
          if (vs[0] == 'Valid') {
            this.rout.navigate(["/admret"]);
            localStorage.setItem("iid", vs[1]);
          }
        });
    }
  }
}