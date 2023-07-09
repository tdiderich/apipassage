import React from "react";
import { Button, Space, Form, Input, Image } from "antd";
import {
  googleLogin,
  microsoftLogin,
  createUserPassword,
} from "../services/Authentication";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/transparent-logo.svg";

export const SignUp = () => {
  const [signUpError, setSignUpError] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    if (values.email && values.password) {
      createUserPassword({
        email: values.email,
        password: values.password,
      })
        .then((success) => {
          if (success) {
            navigate("/credentials");
          }
        })
        .catch(() => setSignUpError(true));
    }
  };

  const onFinishFailed = (errorFields: any) => {
    console.log(errorFields);
  };

  return (
    <React.Fragment>
      {!!!signUpError && (
        <Space direction="vertical" size="middle" className="centered">
          <Image src={logo} alt="logo" height={100} width={100} />
          <Form
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  type: "email",
                  required: true,
                  message: "Please input your email",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  min: 12,
                  message: "Minimum 12 characters",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button htmlType="submit">Sign up with Email</Button>
            </Form.Item>
          </Form>
          <Button onClick={googleLogin}>Sign up with Google</Button>
          <Button onClick={microsoftLogin}>Sign up with Microsoft</Button>
        </Space>
      )}
      {!!signUpError && (
        <Space
          direction="vertical"
          size="middle"
          style={{ textAlign: "center", color: "white" }}
        >
          There was an error. Please try again.
          <Button>
            <Link to="/signup">Try again</Link>
          </Button>
        </Space>
      )}
    </React.Fragment>
  );
};
