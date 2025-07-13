import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateUser } from '../store/authSlice';
import { getCurrentUser } from '../api/userApi';

/**
 * 初始化认证组件
 * 在应用启动时检查token并获取用户信息
 */
const InitializeAuth: React.FC = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // 如果已经认证但没有用户信息，则获取用户信息
    if (isAuthenticated && !user) {
      const fetchUserInfo = async () => {
        try {
          const userData = await getCurrentUser();
          dispatch(updateUser(userData));
        } catch (error) {
          console.error('初始化用户信息失败:', error);
        }
      };

      fetchUserInfo();
    }
  }, [isAuthenticated, user, dispatch]);

  // 这个组件不渲染任何内容
  return null;
};

export default InitializeAuth;