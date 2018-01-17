import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/Auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model : any = {};

  constructor(public authService: AuthService, 
              private alertify: AlertifyService,
              private router: Router) { }

  ngOnInit() {
  }

  login(){
    this.authService.login(this.model).subscribe(data => {
      this.alertify.success("Logged in successully")
    }, error => {      
      this.alertify.error("Failed to log in")
    }, () => {
      this.router.navigate(["/members"])
    });
  }

  logout(){
    this.authService.userToken = null;
    this.authService.currentUser = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.alertify.message("logged out")
    this.router.navigate(["/home"])
  }

  loggedIn(){
    return this.authService.loggedIn();
  }
}
