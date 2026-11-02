export type PermissionEffect = 'grant' | 'revoke' | null;

export interface MenuItem {
  label: string;
  route: string;
  slug: string;
}

export interface MenuModule {
  module: string;
  name: string;
  icon: string | null;
  items: MenuItem[];
}

export interface MyAccess {
  user: {
    id: number;
    name: string;
    last_name: string;
    username: string;
  };
  role: {
    id: number;
    slug: string;
    name: string;
  } | null;
  isAdmin: boolean;
  permissions: string[];
  menu: MenuModule[];
}

export interface AdminUser {
  id: number;
  name: string;
  last_name: string;
  username: string;
  role_id: number | null;
  role_name: string | null;
  role_slug: string | null;
  is_admin: boolean;
}

export interface MatrixPermission {
  id: number;
  name: string;
  slug: string;
  description: string;
  admin_only: boolean;
  from_role: boolean;
  user_effect: 'grant' | 'revoke' | null;
  effective: boolean;
}

export interface MatrixModule {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  permissions: MatrixPermission[];
}

export interface UserPermissionMatrix {
  user: {
    id: number;
    name: string;
    last_name: string;
    username: string;
    roles: Array<{ id: number; name: string; slug: string }>;
    is_admin: boolean;
  };
  modules: MatrixModule[];
}

export interface PermissionChange {
  permission_id: number;
  effect: PermissionEffect;
}
