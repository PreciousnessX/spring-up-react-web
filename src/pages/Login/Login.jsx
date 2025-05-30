import { Form, Input, Button, Card, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  SafetyOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "@/utils/axios";
import "@/styles/login.scss";

function Login() {
  const [captchaId, setCaptchaId] = useState("");
  const [captchaUrl, setCaptchaUrl] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();
  const formRef = useRef(null);

  // 获取验证码
  const getCaptcha = async () => {
    try {
      const response = await axios.get("/api/auth/captcha");
      console.log("验证码获取成功:", response);

      const { code, data } = response;

      if (code === 200) {
        const { captchaId, captchaImage } = data;
        setCaptchaId(captchaId);
        setCaptchaUrl(captchaImage);
      }
    } catch (error) {
      message.error("获取验证码失败：" + error.message);
    }
  };

  useEffect(() => {
    getCaptcha();
  }, []);

  // 切换注册/登录状态
  const toggleRegister = () => {
    setIsRegister(!isRegister);
    formRef.current?.resetFields();
    getCaptcha();
  };

  const onFinish = async (values) => {
    try {
      const data = {
        ...values,
        captchaId,
        captchaCode: values.captcha,
      };

      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const response = await axios.post(endpoint, data);
      const { code, data: resData } = response;

      if (code === 200) {
        if (!isRegister) {
          const { token } = resData;
          // 存储 token，与 AuthGuard 使用相同的键名
          localStorage.setItem("token", token);
          // 如果使用了 Bearer 方案，可以直接存储完整的认证头
          localStorage.setItem("Authorization", `Bearer ${token}`);
          message.success(response.data.message);
          navigate("/"); // 重定向到根路径，会被 AuthGuard 保护
        } else {
          message.success(response.data.message);
          setIsRegister(false); // 切换到登录表单
          formRef.current?.resetFields(); // 清空表单
          getCaptcha(); // 刷新验证码
        }
      }
    } catch (error) {
      message.error(`${isRegister ? "注册" : "登录"}失败：${error.message}`);
      getCaptcha();
    }
  };

  return (
    <div className="login-container">
      <Card title={isRegister ? "用户注册" : "用户登录"} className="login-card">
        <Form
          ref={formRef}
          name={isRegister ? "register" : "login"}
          className="login-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名！" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          {isRegister && (
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "请输入邮箱！" },
                { type: "email", message: "请输入有效的邮箱地址！" },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="邮箱" />
            </Form.Item>
          )}

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "请输入密码！" },
              isRegister && { min: 6, message: "密码长度至少6位！" },
            ].filter(Boolean)}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          {isRegister && (
            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "请确认密码！" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("两次输入的密码不一致！"));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="确认密码"
              />
            </Form.Item>
          )}

          <Form.Item
            name="captcha"
            rules={[{ required: true, message: "请输入验证码！" }]}
          >
            <div style={{ display: "flex", gap: "8px" }}>
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
                  style={{ cursor: "pointer", height: "32px" }}
                  title="点击刷新验证码"
                />
              )}
            </div>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-button">
              {isRegister ? "注册" : "登录"}
            </Button>
            <div style={{ marginTop: "10px", textAlign: "center" }}>
              <span style={{ marginRight: "8px" }}>
                {isRegister ? "已有账号?" : "没有账号?"}
              </span>
              <Button
                type="link"
                onClick={toggleRegister}
                style={{ padding: 0 }}
              >
                {isRegister ? "去登录" : "去注册"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Login;
