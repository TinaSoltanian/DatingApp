import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import { Observable } from "rxjs/Observable";
import { Users } from "../_models/Users";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { UserService } from "./user.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthUser } from "../_models/authUser.ts";
import { environment } from "../../environments/environment";

@Injectable()
export class AuthService {
  baseUrl = environment.apiUrl;
  userToken: any;
  decodedToken: any;
  currentUser: Users;
  private photoUrl = new BehaviorSubject<string>("../../assets/user.png");
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(
    private http: HttpClient,
    private jwtHelperService: JwtHelperService
  ) {}

  changeMemberPhoto(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }

  login(model: Users) {
    return this.http
      .post<AuthUser>(this.baseUrl + "auth/login", model, {
        headers: new HttpHeaders().set("Content-Type", "Application/json")
      })
      .map(user => {
        if (user) {
          localStorage.setItem("token", user.tokenString);
          localStorage.setItem("user", JSON.stringify(user.user));
          this.decodedToken = this.jwtHelperService.decodeToken(
            user.tokenString
          );
          this.userToken = user.tokenString;
          this.currentUser = user.user;
          if (this.currentUser.photoUrl != null) {
            this.changeMemberPhoto(this.currentUser.photoUrl);
          } else {
            this.changeMemberPhoto("../../assets/user.jpg");
          }
        }
      })
  }

  register(user: Users) {
    return this.http
      .post(this.baseUrl + "auth/register", user, {
        headers: new HttpHeaders().set("Content-Type", "Application/json")
      })
  }

  loggedIn() {
    const token = this.jwtHelperService.tokenGetter();

    if (!token) {
      return;
    }

    return !this.jwtHelperService.isTokenExpired(token);
  }
}
