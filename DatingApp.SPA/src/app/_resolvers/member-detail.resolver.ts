import { Injectable } from "@angular/core";
import { Resolve, Router } from "@angular/router";
import { Users } from "../_models/Users";
import { UserService } from "../_services/user.service";
import { AlertifyService } from "../_services/alertify.service";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs/Rx";
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/of';

@Injectable()
export class MemeberDetailResolver implements Resolve<Users> {
  constructor(
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Users> {
    return this.userService.getUser(route.params["id"]).catch(error => {
            this.alertify.error("Problem retrieving data");
            this.router.navigate(["/members"]);
            return Observable.of(null);
    });
  }
}
