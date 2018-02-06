import { Injectable } from "@angular/core";
import { Resolve, Router } from "@angular/router";
import { Users } from "../_models/Users";
import { UserService } from "../_services/user.service";
import { AlertifyService } from "../_services/alertify.service";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';
import { MessagesComponent } from "../messages/messages.component";
import { AuthService } from "../_services/Auth.service";
import { Message } from "../_models/message";

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {
pageSize = 5;
pageNumber = 1;
messageContainer = "Unread";

  constructor(
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService,
    private authService: AuthService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {      
    return this.userService.getMessages(this.authService.decodedToken.nameid,
                this.pageNumber, this.pageSize, this.messageContainer).catch(error => {
            this.alertify.error("Problem retrieving data");
            this.router.navigate(["/members"]);
            return Observable.of(null);
    });
  }
}
