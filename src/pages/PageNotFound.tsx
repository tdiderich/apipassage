import React, { useEffect } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

export const PageNotFound = () => {
  const navigate = useNavigate();
  const [msg, contextHolder] = message.useMessage();
  useEffect(() => {
    msg.destroy();
    msg.warning("Page not found. Returning home.", 1).then(() => {
      navigate("/");
    });
  }, [msg, navigate]);
  return <>{contextHolder}</>;
};
