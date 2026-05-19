/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import { Loading } from '../components';
const Login = lazy(() => import('../pages/Login'));

// 路由配置
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: (
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    ),
  },
  // {
  //   path: '/',
  //   element: (
  //     <RouteGuard>
  //       <MainLayout />
  //     </RouteGuard>
  //   ),
  //   children: [
  //     {
  //       index: true,
  //       element: <Navigate to="/dashboard" replace />,
  //     },
  //     {
  //       path: 'dashboard',
  //       element: (
  //         <Suspense fallback={<Loading />}>
  //           <Dashboard />
  //         </Suspense>
  //       ),
  //     },
  //     {
  //       path: 'users',
  //       element: (
  //         <Suspense fallback={<Loading />}>
  //           <UserManagement />
  //         </Suspense>
  //       ),
  //     },
  //     {
  //       path: '*',
  //       element: (
  //         <Suspense fallback={<Loading />}>
  //           <NotFound />
  //         </Suspense>
  //       ),
  //     },
  //   ],
  // },
]);
