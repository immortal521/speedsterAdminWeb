import { Navigate, useLocation } from 'react-router-dom';

import { useAppSelector } from '@/store/hooks';
import { selectIsAuthenticated } from '@/store/slices/userSlice';

interface RouteGuardProps {
  children: React.ReactNode;
}

/** 需登录才能访问的路由 */
export const RouteGuard = ({ children }: RouteGuardProps) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

/** 已登录用户不应再访问登录页 */
export const GuestGuard = ({ children }: RouteGuardProps) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};
