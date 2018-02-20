import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { AuthService } from './_services/Auth.service';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { AlertifyService } from './_services/alertify.service';
import { MemberlistComponent } from './members/memberlist/memberlist.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './routes';
import { AuthGuard } from './_guards/auth.guard';
import { UserService } from './_services/user.service';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemeberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemeberListResolver } from './_resolvers/member-list.resolver';
import { NgxGalleryModule } from 'ngx-gallery';
import { MemberEditComponent } from './member-edit/member-edit.component';
import { MemeberEditResolver } from './_resolvers/member-edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { PhotoEditorComponent } from './photo-editor/photo-editor.component';
import { FileUploadModule } from 'ng2-file-upload/file-upload/file-upload.module';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/bs-datepicker.config';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {TimeAgoPipe} from 'time-ago-pipe'
import { PaginationModule } from 'ngx-bootstrap';
import { ButtonsModule } from 'ngx-bootstrap/buttons/buttons.module';
import { ListsResolver } from './_resolvers/lists.resolver';
import { MessagesResolver } from './_resolvers/message.resolver';
import { MemberMessagesComponent } from './members/member-messages/member-messages.component';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { ErrorInterceptorProvider } from './_services/error.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    RegisterComponent,
    HomeComponent,
    MemberlistComponent,    
    ListsComponent,
    MessagesComponent,
    MemberCardComponent,
    MemberlistComponent,
    MemberDetailComponent,
    MemberEditComponent,
    PhotoEditorComponent,
    MemberMessagesComponent,
    TimeAgoPipe
],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    RouterModule.forRoot(appRoutes),    
    TabsModule.forRoot(),
    NgxGalleryModule,
    FileUploadModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    ButtonsModule.forRoot(),
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        },
        whitelistedDomains: ['localhost:5000']
      }
    })
  ],
  providers: [AuthService,
              AlertifyService,
              AuthGuard,
              UserService,
              MemeberDetailResolver,
              MemeberListResolver,
              MemeberEditResolver,
              PreventUnsavedChanges,
              ListsResolver,
              MessagesResolver,
              ErrorInterceptorProvider
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
