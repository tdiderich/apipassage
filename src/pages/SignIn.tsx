import React from 'react';
import { Button, Space, Form, Input, Image } from 'antd';
import { googleLogin, signInUserPassword } from '../services/Authentication';

import logo from '../assets/transparent-logo.svg';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const SignIn = () => {
  const [signInError, setSignInError] = useState<
    boolean | 'auth/user-not-found'
  >(false);
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    if (values.email && values.password) {
      signInUserPassword({
        email: values.email,
        password: values.password
      })
        .then(() => navigate('/credentials'))
        .catch((error) => {
          if (error === 'auth/user-not-found') {
            setSignInError('auth/user-not-found');
          } else {
            setSignInError(true);
          }
        });
    }
  };

  const onFinishFailed = (errorFields: any) => {
    console.log(errorFields);
  };

  return (
    <React.Fragment>
      {!!!signInError && (
        <Space direction="vertical" size="middle" className="centered">
          <Image src={logo} alt="logo" height={100} width={100} />
          <Form
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
            className="centered"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  type: 'email',
                  required: true,
                  message: 'Please input your email'
                }
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
                  message: 'Please input your password'
                }
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button htmlType="submit">Sign in with Email</Button>
            </Form.Item>
          </Form>
          <Button onClick={googleLogin}>Sign in with Google</Button>
        </Space>
      )}
      {!!signInError && signInError === 'auth/user-not-found' && (
        <Space direction="vertical" size="middle" className="centered">
          Looks like you don't have an account yet. Please sign up instead.
          <Button>
            <Link to="/signup">Sign up</Link>
          </Button>
        </Space>
      )}
      {!!signInError && signInError !== 'auth/user-not-found' && (
        <Space direction="vertical" size="middle" className="centered">
          Something went wrong. Please try again.
          <Button>
            <Link to="/signin">Try again</Link>
          </Button>
        </Space>
      )}
    </React.Fragment>
  );
};
