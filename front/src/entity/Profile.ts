class Profile {
  email: string;
  familyName: string;
  givenName: string;
  name: string;
  nickname: string;
  role: string;
  

  constructor(
    email: string,
    name: string,
    nickname: string,
    givenName: string,
    familyName: string,
    role: string,
  ) {
    this.email = email;
    this.familyName = familyName;
    this.givenName = givenName;
    this.nickname = nickname;
    this.name = name;
    this.role = role;
  }
}

export default Profile;
