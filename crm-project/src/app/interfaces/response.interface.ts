import { User } from './user.interface';

export interface LoginResponse {
  message: string;
  data: {
    user: User;
    token: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface FileImportResponse {
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

export interface StatusStatResponse {
  count: number;
  status: string;
}
