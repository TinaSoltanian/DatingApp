import { Component, OnInit, Input, Output } from '@angular/core';
import { Photo } from '../_models/Photo';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { environment } from '../../environments/environment';
import { AuthService } from '../_services/Auth.service';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import * as _ from 'underscore';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
@Input() photos: Photo[];
uploader: FileUploader;
public hasBaseDropZoneOver:boolean = false;
baseUrl = environment.apiUrl;
currentMain: Photo;
@Output() getMemberPhotoChanged = new EventEmitter<string>();

  constructor(private authService: AuthService,
              private userService: UserService,
              private alertify: AlertifyService) { }

  ngOnInit() {
    this.initUploader();
  }

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }
 
  initUploader(){
    this.uploader = new FileUploader({
      url: this.baseUrl + 'users/' + this.authService.decodedToken.nameid + '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onSuccessItem = (item, response, status, header) => {
      if(response){
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          description: res.description,
          dateAdded: res.dateAdded,
          isMain: res.isMain          
        }

        this.photos.push(photo);
      };
    };
  }

setMainPhoto(photo: Photo){
  this.userService.setMainPhoto(this.authService.decodedToken.nameid, photo.id).subscribe(()=> {
    this.currentMain = _.findWhere(this.photos, {isMain: true});
    this.currentMain.isMain = false;
    photo.isMain = true;
    this.authService.changeMemberPhoto(photo.url);
    this.authService.currentUser.photoUrl = photo.url;
    localStorage.setItem("user",JSON.stringify(this.authService.currentUser));
  }, error => {
    this.alertify.error(error);
  })
}
}
