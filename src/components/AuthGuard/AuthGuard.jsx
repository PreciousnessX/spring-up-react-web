import { Navigate, useLocation } from 'react-router-dom';

const AuthGuard = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('token'); // 假设使用token判断登录状态

  if (!isAuthenticated) {
    // 将用户重定向到登录页面，并记录他们试图访问的URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  } else if (location.pathname === '/login') {
    // 如果用户已经登录，且试图访问登录页面，则重定向到主页
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthGuard;
