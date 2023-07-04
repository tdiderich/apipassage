import React, { ReactNode, Suspense } from 'react';
import { Link } from 'react-router-dom';
import {
  ProfileOutlined,
  HomeOutlined,
  LoginOutlined,
  PlusCircleOutlined,
  MenuOutlined,
  LogoutOutlined,
  TeamOutlined,
  ToolOutlined
} from '@ant-design/icons';
import { Dropdown, MenuProps } from 'antd';
import { adios } from '../services/Authentication';

interface LayoutProps {
  authenticated: boolean;
  children: ReactNode;
}

const authenticatedItems: MenuProps['items'] = [
  {
    key: '1',
    label: <Link to="/credentials">Credentials</Link>,
    icon: <ToolOutlined />
  },
  {
    key: '2',
    label: <Link to="/teams">Teams</Link>,
    icon: <TeamOutlined />
  },
  {
    key: '3',
    label: <Link to="/profile">Profile</Link>,
    icon: <ProfileOutlined />
  },
  {
    key: '4',
    label: (
      <a href="/signin" onClick={adios}>
        Sign out
      </a>
    ),
    icon: <LogoutOutlined />
  }
];

const unauthenticatedItems: MenuProps['items'] = [
  {
    key: '1',
    label: <Link to="/">Home</Link>,
    icon: <HomeOutlined />
  },
  {
    key: '2',
    label: <Link to="/signin">Sign in</Link>,
    icon: <LoginOutlined />
  },
  {
    key: '3',
    label: <Link to="/signup">Sign up</Link>,
    icon: <PlusCircleOutlined />
  }
];

export const Layout = ({ authenticated, children }: LayoutProps) => {
  const items = authenticated ? authenticatedItems : unauthenticatedItems;
  return (
    <React.Fragment>
      <Suspense>
        <Dropdown menu={{ items }} className="app-nav nav">
          <MenuOutlined />
        </Dropdown>
        <header className="app-header">{children}</header>
      </Suspense>
    </React.Fragment>
  );
};
