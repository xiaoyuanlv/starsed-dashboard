import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// layouts
import { AdminComponent } from "./layouts/admin/admin.component";
import { AuthComponent } from "./layouts/auth/auth.component";

// auth views
import { LoginComponent } from "./views/auth/login/login.component";
import { ForgotpasswordComponent } from './views/auth/forgotpassword/forgotpassword.component';


// member views
import { DashboardComponent } from './views/member/dashboard/dashboard.component';
import { VolunteerComponent } from './views/member/volunteer/volunteer.component';
import { WishComponent } from './views/member/wish/wish.component';
import { LetterComponent } from './views/member/letter/letter.component';
import { SettingsComponent } from './views/member/settings/settings.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { CreativestarComponent } from "./views/member/creativestar/creativestar.component";
import { OrganizationComponent } from "./views/member/organization/organization.component";



const routes: Routes = [
  // member views
  {
    path: "member",
    component: AdminComponent,
    children: [
      { path: "dashboard", component: DashboardComponent, canActivate: [AuthGuard] },
      { path: "star", component: CreativestarComponent, canActivate: [AuthGuard] },
      { path: "volunteer", component: VolunteerComponent, canActivate: [AuthGuard] },
      { path: "organization", component: OrganizationComponent, canActivate: [AuthGuard] },
      { path: "wish", component: WishComponent, canActivate: [AuthGuard] },
      { path: "letter", component: LetterComponent, canActivate: [AuthGuard] },
      { path: "settings", component: SettingsComponent, canActivate: [AuthGuard] },
      { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  // auth views
  {
    path: "auth",
    component: AuthComponent,
    children: [
      { path: "login", component: LoginComponent },
      { path: "forgotpassword", component: ForgotpasswordComponent },
      { path: '**', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
