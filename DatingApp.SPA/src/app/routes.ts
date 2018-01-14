import { Routes } from '@angular/router'
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { MemberlistComponent } from './memberlist/memberlist.component';
import { AuthGuard } from './_guards/auth.guard';

export const appRoutes: Routes  = [
    {path: "home", component: HomeComponent},
    {
        path: "",
        runGuardsAndResolvers: "always",
        canActivate: [AuthGuard],
        children: [
            {path: "members", component: MemberlistComponent},
            {path: "messages", component: MessagesComponent},
            {path: "lists", component: ListsComponent},        
        ]
    },
    {path: "**", redirectTo: "home", pathMatch:"full"},
]