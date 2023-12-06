export interface Tokens {
  access_token?: string;
  refresh_token?: string;
}

export interface User {
  uid: string;
  email?: string;
  emailVerified: boolean;
  displayName?: string;
  photoURL?: string;

  phoneNumber?: string;

  disabled: boolean;
}
