export class User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  profileImg: string;

  constructor(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    profileImg: string
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.profileImg = profileImg;
  }
}
