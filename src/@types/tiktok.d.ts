interface TiktokAccount {
  email: string;
  email_password: string;
  payment: string;
  password: string;
  twoFaEnabled: boolean;
  currency: string;
  uid: string;
  secret: string;
  status?: string;
}

interface LoginTiktokStatusEventPayload {
  uid: string;
  error?: any;
  success?: boolean;
  pending?: boolean;
  action?: string;
}
