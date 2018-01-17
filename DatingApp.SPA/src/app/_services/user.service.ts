import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Users } from '../_models/Users';
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class UserService {
    baseUrl = environment.apiUrl;

constructor(private authHttp: AuthHttp) { }

getUsers(): Observable<Users[]>{
    return this.authHttp.get( this.baseUrl + "users")
         .map(response => <Users[]>response.json())  
         .catch(this.handleError);
}

getUser(id): Observable<Users>{
    return this.authHttp.get(this.baseUrl + 'users/' + id)
    .map(response => <Users>response.json())    
    .catch(this.handleError);
}

updateUser(id: number, user: Users){
    return this.authHttp.put(this.baseUrl + 'users/' + id, user).catch(this.handleError);
}

setMainPhoto(userId: number, id: number){
    return this.authHttp.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {}).catch(this.handleError);
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