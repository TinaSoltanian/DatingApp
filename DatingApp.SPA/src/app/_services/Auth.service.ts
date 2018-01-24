import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import { Observable } from 'rxjs/Observable';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { Users } from '../_models/Users';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UserService } from './user.service';


@Injectable()
export class AuthService {
  baseUrl = "http://localhost:5000/api/auth/";             
  userToken: any;    
  decodedToken: any;
  currentUser : Users;
  jwtHelper: JwtHelper = new JwtHelper();
  private photoUrl = new BehaviorSubject<string>('../../assets/user.png')
  currentPhotoUrl = this.photoUrl.asObservable();

constructor(private http: Http) { }

changeMemberPhoto(photoUrl : string){
    this.photoUrl.next(photoUrl);
}

login(model: Users){

    return this.http.post(this.baseUrl + 'login', model, this.getOptions()).map((response: Response) => {
        const user = response.json();
        if (user){
            localStorage.setItem("token", user.tokenString);
            localStorage.setItem("user", JSON.stringify(user.user));
            this.decodedToken = this.jwtHelper.decodeToken(user.tokenString);
            this.userToken = user.tokenString;
            if(this.currentUser.photoUrl != null){
                this.changeMemberPhoto(this.currentUser.photoUrl);
            }else{
                this.changeMemberPhoto('../../assets/user.jpg');
            }

        }
    }).catch(this.handleError);
}

register(model: any){
    return this.http.post(this.baseUrl + "register", model, this.getOptions()).catch(this.handleError);;
}

loggedIn(){
    return tokenNotExpired('token');
}

getOptions(){
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});
    return options;
}

private handleError(error: any){
    const applicationError = error.headers.get("Application-Error");
    if (applicationError){
            return Observable.throw(applicationError);
    }

    const serverError = error.json();
    let modelStateError = "";
    if (serverError){
        for(const key in serverError){
            if (serverError[key]){
                modelStateError += serverError[key] + "\n";
            }
        }
    }
    return Observable.throw( modelStateError || "Server error" );
}

}