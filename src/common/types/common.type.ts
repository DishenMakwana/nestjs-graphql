export type RoleType = 'admin' | 'user';
export type PermissionType = 'all' | 'view';

export type AuthUserType = {
  id: number;
  email: string;
  role: RoleType;
  access_token: string;
  name: string;
};

export type PayloadType = {
  search?: string | null;
  limit?: number;
  page?: number;
  sort?: string | null;
  order?: string | null;
};

export type Tokens = {
  access_token: string;
  refresh_token: string;
};

export type Payload = {
  sub: string;
  email: string;
  role: number;
};

export type UserRegisterEvent = {
  email: string;
  otp: string;
};

export type ForgotPasswordEvent = {
  email: string;
  otp: string;
};

export type OrderType = 'asc' | 'desc';

export type AWSFileType = {
  fileName: string;
  mimetype: string;
};
