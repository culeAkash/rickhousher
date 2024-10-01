export type ApiResponse = {
  success: boolean;
  message: string;
  messages?: string[];
  data?: any;
};

export type FormState = {
  errors: {
    username?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string;
  success?: boolean;
};
