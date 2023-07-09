import React from "react";
import { Space, Button } from "antd";
import { sendEmailVerification } from "firebase/auth";
import { useAuthListener } from "../services/Authentication";

export const Verify = () => {
  const { user } = useAuthListener();
  return (
    <React.Fragment>
      <Space direction="vertical" className="centered">
        Please Verify Your Email To Continue
        <Button onClick={() => sendEmailVerification(user)}>
          Resend Verification Email
        </Button>
      </Space>
    </React.Fragment>
  );
};
