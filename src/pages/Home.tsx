import React from 'react';
import logo from '../assets/slim-logo-with-name.svg';
import { Button, Space, Image } from 'antd';
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <React.Fragment>
      <Space direction="vertical" size="middle" className="centered">
        <Image src={logo} alt="logo" />
      </Space>
      <Space size="middle" className="centered-extra">
        <Button>
          <Link to="/signin">Sign in</Link>
        </Button>
        <Button>
          <Link to="/signup">Sign up</Link>
        </Button>
      </Space>
    </React.Fragment>
  );
};
