import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserauthService {

  constructor(private http: HttpClient) { }

  initiateMailVerification(email: string) {
    return this.http.post<any>('http://localhost:3000/email/initiateMailVerification', { "email": email });
  }

  verifyMailOtp(email: string, otp: string) {
    return this.http.post<any>('http://localhost:3000/email/verifyMailOtp', { "email": email, "otp": otp });
  }

  signUpUser(user: UserModel) {
    return this.http.post<any>('http://localhost:3000/users/signup', { "user": user });
  }

  loginUser(username: string, password: string) {
    return this.http.post<any>('http://localhost:3000/users/login', { "username": username, "password": password });
  }

  dupeUsernameCheck(username: string) {
    return this.http.post<any>('http://localhost:3000/users/dupeUsernameCheck', { "username": username });
  }

  dupeEmailCheck(email: string) {
    return this.http.post<any>('http://localhost:3000/users/dupeEmailCheck', { "email": email });
  }

  userSearch(username: string) {
    return this.http.post<any>('http://localhost:3000/users/searchuser', { "username": username });
  }

  addContactToBoth(contact: string) {
    return this.http.post<any>('http://localhost:3000/users/addContactToBoth', { "firstUsername": "nfsboy", "secondUsername": contact });
  }



  loginStatus() {
    if (localStorage.getItem('id') && localStorage.getItem('token')) {
      return true;
    }
    else if (!(!!localStorage.getItem('id') && !!localStorage.getItem('token') && !!localStorage.getItem('username'))) {
      localStorage.removeItem('token');
      localStorage.removeItem('id');
      localStorage.removeItem('username');
      return false;
    }
    else {
      return false;
    }
  };

  logOutUser() {
    let token = localStorage.getItem('token');
    let id = localStorage.getItem('id');
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    return this.http.post<any>('http://localhost:3000/users/logout', { "id": id });
  }

}
