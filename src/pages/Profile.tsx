import React, { useEffect } from "react";
import { Space, Button } from "antd";
import { useState } from "react";
import { getSelf, User } from "../services/Database";
import { adios } from "../services/Authentication";

export const Profile = ({ userUID }: any) => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    getSelf(userUID).then((user) => {
      setUser(user);
    });
  }, [userUID]);

  return (
    <React.Fragment>
      <Space direction="vertical">
        {user?.email ? `Hello ${user.email}!` : "Hello there!"}
        <Button onClick={() => adios()}>Sign Out</Button>
      </Space>
    </React.Fragment>
  );
};
