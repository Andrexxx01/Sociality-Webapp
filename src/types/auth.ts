export type AuthUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
};

export type AuthState = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
};

export type SetCredentialsPayload = {
  token: string;
  user: AuthUser;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  username: string;
  email: string;
  password: string;
  phone?: string;
};

export type AuthResponseData = {
  token: string;
  user: AuthUser;
};
