import { Component, OnInit } from '@angular/core';
import { Users } from '../../_models/Users';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from '../../_models/pagination';

@Component({
  selector: 'app-memberlist',
  templateUrl: './memberlist.component.html',
  styleUrls: ['./memberlist.component.css']
})
export class MemberlistComponent implements OnInit {
  users: Users[]; 
  user : Users = JSON.parse(localStorage.getItem('user'));
  genderList = [{value: 'male', display:'Males'},{values:'female', display: 'Females'}]
  userParams: any = {};
  pagination: Pagination;
  
  constructor(private userService: UserService, 
    private alertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {  
    this.route.data.subscribe( data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;    })

    this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = "astActive"
  }

loadUsers(){
  this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams)
  .subscribe((res: PaginatedResult<Users[]>) =>{
    this.users = res.result;
    this.pagination = res.pagination;
  }, error => {
    this.alertify.error(error);
  })
}

resetFilter(){
  this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
  this.userParams.minAge = 18;
  this.userParams.maxAge = 99;
  this.loadUsers();
}
  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }
}
