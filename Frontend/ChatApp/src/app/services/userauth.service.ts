import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserauthService {

  constructor(private http: HttpClient) { }

  initiateMailVerification(email: string) {
    return this.http.post<any>('http://localhost:7000/email/initiateMailVerification', { "email": email });
  }

  verifyMailOtp(email: string, otp: string) {
    return this.http.post<any>('http://localhost:7000/email/verifyMailOtp', { "email": email, "otp": otp });
  }

  signUpUser(user: UserModel) {
    return this.http.post<any>('http://localhost:7000/users/signup', { "user": user });
  }

  loginUser(username: string, password: string) {
    return this.http.post<any>('http://localhost:7000/users/login', { "username": username, "password": password });
  }

  dupeUsernameCheck(username: string) {
    return this.http.post<any>('http://localhost:7000/users/dupeUsernameCheck', { "username": username });
  }

  dupeEmailCheck(email: string) {
    return this.http.post<any>('http://localhost:7000/users/dupeEmailCheck', { "email": email });
  }

}
