import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CommunService {
  url: string;
  stu: string;
  ddf: any;
  ddu: any;
  logc: string;
  logt: string;
  nst: string;
  alot: string;
  rqrm: string;

  constructor(private http: HttpClient) {
    this.url = "https://nkkr.in/dyna";
    this.stu = this.url + "/addstu.php?";
    this.ddf = this.url + "/streq.php?";
    this.ddu = this.url + "/confirm.php?";
    this.logc = this.url + "/admunlock.php?";
    this.logt = this.url + "/admlock.php?";
    this.nst = this.url + "/nstreq.php?";
    this.alot = this.url + "/admalot.php?";
    this.rqrm = this.url + "/admreqremov.php?";
  }

  nsadm(data: any) {
    return this.http.post(this.stu, data, { responseType: 'text' });
  }

  exstu(data: any) {
    return this.http.get(this.ddf + "phno='" + data.lnum + "'&dob='"
      + data.ldob + "'", { responseType: 'text' });
  }

  updt(data: any) {
    return this.http.get(this.ddu + "phno='" + data.lnum + "'&dob='"
      + data.ldob + "'", { responseType: 'text' });
  }

  logcheckin(data: any) {
    return this.http.get(this.logc + "uname='" + data.lemail + "'&pass='" + data.lpass + "'", { responseType: 'text' });
  }

  logcheckout(data: any) {
    return this.http.get(this.logt + "uid='" + data + "'", { responseType: 'text' });
  }

  aret(data: any, da: string) {
    console.log((data && data.bg !== undefined ? data.bg : '') + "  " + da);
    return this.http.get(this.nst + "dstr=" + data.dstr + "&dat=" + da + "", { responseType: 'text' });
  }

  reqcheckout(data: string) {
    return this.http.get(this.alot + "yd=" + data + "", { responseType: 'text' });
  }

  reqremove(data: string) {
    return this.http.get(this.rqrm + "yd=" + data + "", { responseType: 'text' });
  }

  checking(fgcomponent: FormGroup, errorObj: any) {
    for (let i in fgcomponent.controls) {
      var objd = fgcomponent.controls[i];
      if (objd instanceof FormControl) {
        if (objd.errors) {
          return errorObj[i][Object.keys(objd.errors)[0]];
        }
      }
    }
  }
}
