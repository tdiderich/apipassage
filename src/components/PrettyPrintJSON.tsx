import React from "react";
import { Space } from "antd";

export const PrettyPrintJson = ({ json, className }: any) => (
  <Space>
    <pre>{JSON.stringify(json, null, 2)}</pre>
  </Space>
);
