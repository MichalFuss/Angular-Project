export class registerModel {
  name: string;
    email: string;
    password: string;
}
export class LoginModel {
  email: string;
    password: string;
}   
export class UserModel {
  id: string;
    name: string;
    email: string;
    role: string;
}
export class AuthResponseModel {
  user: UserModel;
  token: string;
}