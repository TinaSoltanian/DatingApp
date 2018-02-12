import { Component, OnInit } from '@angular/core';
import { Users } from '../../_models/Users';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { error } from 'util';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { ViewChild } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap/tabs/tabset.component';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  [x: string]: any;
  @ViewChild('memberTabs') memberTabs : TabsetComponent;
  user: Users;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(private userSErvice: UserService,
              private alertify: AlertifyService,
              private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.data.subscribe( data => {
      this.user =   data['user'];
    }); 

    this.route.queryParams.subscribe( params => {
      this.memberTabs.tabs[params['tab']].active = true;
    })

    this.galleryOptions = [{
      width: '500px',
      height: '500px',
      imagePercent: 100,
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide
    },{      preview: false}]

    this.galleryImages = this.getImages();  
  }

  getImages(){
    const imageUrls = [];
    for(let i =0; i < this.user.photos.length; i++){
      imageUrls.push({
        small: this.user.photos[i].url,
        medium: this.user.photos[i].url,
        big: this.user.photos[i].url,
        description: this.user.photos[i].description       
      });
    }
    return imageUrls;
  }

  selectTab(tabId: number){
    this.memberTabs.tabs[tabId].active = true;
  }
}
