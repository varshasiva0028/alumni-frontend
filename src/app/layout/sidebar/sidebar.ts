import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CommunService } from 'src/app/commun.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  constructor(private serving: CommunService, private rout: Router) {}

  logout() {
    this.serving.logcheckout(localStorage.getItem('iid')).subscribe(
      (res: any) => { });
    localStorage.clear();
    this.rout.navigate(["/admsign"]);
  }
}