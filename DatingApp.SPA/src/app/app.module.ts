import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http'
import { FormsModule } from '@angular/forms'
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
import { AuthModule } from './auth/auth.module';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemeberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemeberListResolver } from './_resolvers/member-list.resolver';
import { NgxGalleryModule } from 'ngx-gallery';
import { MemberEditComponent } from './member-edit/member-edit.component';
import { MemeberEditResolver } from './_resolvers/member-edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { PhotoEditorComponent } from './photo-editor/photo-editor.component';


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
    PhotoEditorComponent
],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    AuthModule,
    TabsModule.forRoot(),
    NgxGalleryModule
  ],
  providers: [AuthService,
              AlertifyService,
              AuthGuard,
              UserService,
              MemeberDetailResolver,
              MemeberListResolver,
              MemeberEditResolver,
              PreventUnsavedChanges
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
