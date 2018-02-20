import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { Observable } from "rxjs/Observable";
import { Users } from "../_models/Users";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import { PaginatedResult } from "../_models/pagination";
import { Message } from "../_models/message";
import { HttpClient, HttpParams } from "@angular/common/http";
import { MessagesComponent } from "../messages/messages.component";

@Injectable()
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private authHttp: HttpClient) {}

  getUsers(page?, itemsPerPage?, userParams?: any, likesParam?: string) {
    const paginatedResult: PaginatedResult<Users[]> = new PaginatedResult<
      Users[]
    >();
    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params.append("pageNumber", page);
      params.append("pageSize", itemsPerPage);
    }

    if (likesParam === "Likers") {
      params.append("Likers", "true");
    }

    if (likesParam === "Likees") {
      params.append("Likees", "true");
    }

    if (userParams != null) {
      params.append("minAge", userParams.minAge);
      params.append("maxAge", userParams.maxAge);
      params.append("gender", userParams.gender);
      params.append("orderBy", userParams.orderBy);
    }

    return this.authHttp
      .get<Users[]>(this.baseUrl + "users", { observe: "response", params })
      .map(response => {
        paginatedResult.result = response.body;

        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
  }

  getUser(id): Observable<Users> {
    return this.authHttp
      .get<Users>(this.baseUrl + "users/" + id)
  }

  updateUser(id: number, user: Users) {
    return this.authHttp
      .put(this.baseUrl + "users/" + id, user)
  }

  setMainPhoto(userId: number, id: number) {
    return this.authHttp
      .post(this.baseUrl + "users/" + userId + "/photos/" + id + "/setMain", {})
  }

  deletePhoto(userId: number, id: number) {
    return this.authHttp
      .delete(this.baseUrl + "users/" + userId + "/photos/" + id)
  }

  sendLike(id: number, recipientId) {
    return this.authHttp
      .post(this.baseUrl + "users/" + id + "/like/" + recipientId, {})
  }

  getMessages(id, page?, itemsPerPage?, messageContainer?: string) {
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<
      Message[]
    >();

    let params = new HttpParams();

    params.append("MessageContainer", messageContainer);

    if (page != null && itemsPerPage != null) {
      params.append("pageNumber", page);
      params.append("pageSize", itemsPerPage);
    }

    return this.authHttp
      .get<Message[]>(this.baseUrl + "users/" + id + "/messages", {
        observe: "response",
        params
      })
      .map(response => {
        paginatedResult.result = response.body;

        if (response.headers.get("Pagination") != null) {
          paginatedResult.pagination = JSON.parse(
            response.headers.get("Pagination")
          );
        }
        return paginatedResult;
      })
  } 

  getMessageThread(id: number, recipientId: number) {
    return this.authHttp
      .get<Message[]>(this.baseUrl + "users/" + id + "/messages/thread/" + recipientId)
  }

  sendMessage(id: number, message: Message) {
    return this.authHttp
      .post<Message>(this.baseUrl + "users/" + id + "/messages", message)
  }

  deleteMessage(id: number, userId: number) {
    return this.authHttp
      .post(this.baseUrl + "users/" + userId + "/messages/" + id, {})
      .map(response => {})
  }

  markAsRead(userId: number, messageId: number) {
    return this.authHttp
      .post(
        this.baseUrl + "users/" + userId + "/messages/" + messageId + "/read",
        {}
      )
      .subscribe();
  }
}
