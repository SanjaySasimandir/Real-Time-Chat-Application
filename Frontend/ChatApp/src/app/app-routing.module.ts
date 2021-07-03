import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { ChatComponent } from './chat/chat.component';
import { ChatboxComponent } from './chat/chatbox/chatbox.component';
import { LandingComponent } from './landing/landing.component';
import { LoggedinGuard } from './loggedin.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  // { path: "", component: LandingComponent },
  { path: "signup", canActivate: [LoggedinGuard], component: RegisterComponent },
  { path: "login", canActivate: [LoggedinGuard], component: LoginComponent },
  { path: "", canActivate: [AuthGuard], component: ChatComponent, children: [{ path: ":username", component: ChatboxComponent }] }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
