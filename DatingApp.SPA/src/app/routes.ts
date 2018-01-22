import { Routes } from '@angular/router'
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { MemberlistComponent } from './members/memberlist/memberlist.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemeberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemeberListResolver } from './_resolvers/member-list.resolver';
import { MemberEditComponent } from './member-edit/member-edit.component';
import { MemeberEditResolver } from './_resolvers/member-edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';

export const appRoutes: Routes  = [
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: "home", component: HomeComponent},
    {
        path: "",
        runGuardsAndResolvers: "always",
        canActivate: [AuthGuard],
        children: [
            {path: "members", component: MemberlistComponent, resolve:{users: MemeberListResolver}},
            {path: "members/:id", component: MemberDetailComponent, resolve:{user: MemeberDetailResolver}},
            {path: "member/edit", component: MemberEditComponent, 
                resolve: {user: MemeberEditResolver}, canDeactivate: [PreventUnsavedChanges]},
            {path: "messages", component: MessagesComponent},
            {path: "lists", component: ListsComponent},        
        ]
    },
    {path: "**", redirectTo: "home", pathMatch:"full"},
]