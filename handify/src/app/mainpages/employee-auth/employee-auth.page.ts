import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-auth',
  templateUrl: './employee-auth.page.html',
  styleUrls: ['./employee-auth.page.scss'],
  standalone: false
})
export class EmployeeAuthPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() { }

  goToLogin() {
    this.router.navigate(['/employee-login']);
  }

  goToSignup() {
    this.router.navigate(['/employee-registration']);
  }
}
