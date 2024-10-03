import { LucideIcon } from "lucide-react";

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
  icon: any;
  href: string;
  color: string;
};

export type DashboardTool = {
  label: string;
  icon: LucideIcon;
  href: string;
  color: string;
  bgColor: string;
};

export type HeadingProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  bgColor?: string;
};