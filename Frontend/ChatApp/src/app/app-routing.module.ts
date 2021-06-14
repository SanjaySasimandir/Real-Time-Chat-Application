import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ChatboxComponent } from './chat/chatbox/chatbox.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: "", component: LandingComponent },
  { path: "signup", component: RegisterComponent },
  { path: "login", component: LoginComponent },
  { path: "chat", component: ChatComponent, children: [{ path: ":username", component: ChatboxComponent }] }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
