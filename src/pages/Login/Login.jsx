import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from '@/utils/axios';
import '@/styles/login.scss';

function Login() {
  const [captchaId, setCaptchaId] = useState('');
  const [captchaUrl, setCaptchaUrl] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // 获取验证码
  const getCaptcha = async () => {
    try {
      const response = await axios.get('/api/auth/captcha');
      if (response.data) {
        setCaptchaId(response.data.captchaId);
        setCaptchaUrl(response.data.captchaImage);
      }
    } catch (error) {
      message.error('获取验证码失败：' + error.message);
    }
  };

  useEffect(() => {
    getCaptcha();
  }, []);

  const onFinish = async (values) => {
    try {
      const loginData = {
        ...values,
        captchaId,
        captchaCode: values.captcha
      };
      const response = await axios.post('/api/auth/login', loginData);
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        message.success('登录成功！');
        navigate(from); // 导航到之前尝试访问的页面或首页
      }
    } catch (error) {
      message.error('登录失败：' + error.message);
      getCaptcha(); // 刷新验证码
    }
  };

  return (
    <div className="login-container">
      <Card title="用户登录" className="login-card">
        <Form
          name="login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名！' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item
            name="captcha"
            rules={[{ required: true, message: '请输入验证码！' }]}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              <Input
                prefix={<SafetyOutlined />}
                placeholder="验证码"
                style={{ flex: 1 }}
              />
              {captchaUrl && (
                <img
                  src={captchaUrl}
                  alt="验证码"
                  onClick={getCaptcha}
                  style={{ cursor: 'pointer', height: '32px' }}
                  title="点击刷新验证码"
                />
              )}
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Login;
