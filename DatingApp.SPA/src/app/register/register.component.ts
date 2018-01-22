import { Component, OnInit, Output, Input } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { AuthService } from '../_services/Auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
model: any = {};
@Output() cancelRegister = new EventEmitter();
registerForm: FormGroup;

  constructor(private authService: AuthService, 
    private aletify: AlertifyService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.createRegistrationForm();
  }

  createRegistrationForm(){
    this.registerForm = this.fb.group({
      username: ['',Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', Validators.required]
    },{ validator: this.passwordMatchValidator});
  }

  passwordMatchValidator(g: FormGroup){
    return g.get('password').value === g.get('confirmPassword').value ? null : {'mismatch': true};
  }

  register(){
    // this.authService.register(this.model).subscribe(() => {
    //   this.aletify.success("Registered successfully!");
    // }, error => {
    //   this.aletify.error(error);
    // });
console.log(this.registerForm.value);
  }

  cancel(){
    this.cancelRegister.emit(false);    
  }
}
