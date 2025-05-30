import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from '@/utils/axios';
import '@/styles/login.scss';

function Login() {
  const onFinish = async (values) => {
    try {
      const response = await axios.post('/api/auth/login', values);
      if (response.success) {
        message.success('登录成功！');
        // TODO: 保存 token 并跳转到首页
      }
    } catch (error) {
      message.error('登录失败：' + error.message);
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
