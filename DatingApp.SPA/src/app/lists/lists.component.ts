import { Component, OnInit } from "@angular/core";
import { Users } from "../_models/Users";
import { Pagination, PaginatedResult } from "../_models/pagination";
import { AuthService } from "../_services/Auth.service";
import { AlertifyService } from "../_services/alertify.service";
import { ActivatedRoute } from "@angular/router";
import { UserService } from "../_services/user.service";

@Component({
  selector: "app-lists",
  templateUrl: "./lists.component.html",
  styleUrls: ["./lists.component.css"]
})
export class ListsComponent implements OnInit {
  users: Users[];
  pagination: Pagination;
  likesParam: string;

  constructor(
    private authService: AuthService,
    private alertify: AlertifyService,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {

    this.route.data.subscribe(data => {
      this.users = data["user"].result;
      this.pagination = data["user"].pagination;
    });

    this.likesParam = "Likers";
  }

  loadUsers() {
    this.userService
      .getUsers(
        this.pagination.currentPage,
        this.pagination.itemsPerPage,
        null,
        this.likesParam
      )
      .subscribe(
        (res: PaginatedResult<Users[]>) => {
          this.users = res.result;
          this.pagination = res.pagination;
        },
        error => {
          this.alertify.error(error);
        }
      );
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }
}
