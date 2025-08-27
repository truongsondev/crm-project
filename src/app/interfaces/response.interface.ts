import { User } from './user.interface';

export interface DataLoginResponse {
  message: string;
  data: {
    user: User;
    token: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface DataResponse {
  failed: any[];
  success: any[];
}

export interface TokenResponse {
  data: {
    user: User;
    token: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface LeadSourceStatResponse {
  count: number;
  lead_source: string;
}
