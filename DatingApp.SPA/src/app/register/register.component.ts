import { Component, OnInit, Output, Input } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { AuthService } from '../_services/Auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
model: any = {};
@Output() cancelRegister = new EventEmitter();

  constructor(private authService: AuthService, private aletify: AlertifyService) { }

  ngOnInit() {
  }

  register(){
    this.authService.register(this.model).subscribe(() => {
      this.aletify.success("Registered successfully!");
    }, error => {
      this.aletify.error(error);
    });

  }

  cancel(){
    this.cancelRegister.emit(false);    
  }
}
