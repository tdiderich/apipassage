import React, { useEffect } from 'react';
import { Button } from 'antd';
import { useState } from 'react';
import { getSelf } from '../services/Database';
import { adios } from '../services/Authentication';

export const Profile = ({ userUID }: any) => {
  const [user, setUser] = useState({});

  useEffect(() => {
    getSelf(userUID).then((user) => {
      setUser(user);
      console.log(user);
    });
  }, [userUID]);

  return (
    <React.Fragment>
      <Button onClick={() => adios()}>Sign Out</Button>
    </React.Fragment>
  );
};
