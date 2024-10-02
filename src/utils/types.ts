export type ApiResponse = {
  success: boolean;
  message: string;
  messages?: string[];
  data?: any;
};

export type SignUpFormState = {
  errors: {
    username?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string;
  success?: boolean;
};

export type SidebarRoute = {
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  color: string;
};

export type DashboardTool = {
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  color: string;
  bgColor: string;
};
