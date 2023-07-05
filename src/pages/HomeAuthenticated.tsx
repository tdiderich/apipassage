import React, { useState } from "react";
import { Button, Space, Form, Input, Select } from "antd";
import { PrettyPrintJson } from "../components/PrettyPrintJSON";
import axios from "axios";

interface SingleSecuritySearchResponse {
  vendor: string;
  data: Object;
}

interface CompleteSecuritySearchResponse {
  data?: SingleSecuritySearchResponse[];
}

type SecuritySearchFormValues = {
  ipAddress: string;
};

type UrlParams = {
  ipAddress?: string;
};

const onFinish = (values: any) => {
  console.log("Success:", values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

export const HomeAuthenticated = () => {
  const [loading, setLoading] = useState(false);
  const [results, setSecuritySearchResults] = useState<any>();

  const runSecuritySearch = async (ipAddress: string) => {
    setLoading(true);
    const url = "https://tylerdiderich.com/api/search/ip";
    axios
      .get<CompleteSecuritySearchResponse>(url, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        params: { ipAddress: ipAddress },
      })
      .then((response) => {
        setSecuritySearchResults(response.data);
      })
      .then(() => setLoading(false))
      .catch((error) => console.log(error));
  };
  return (
    <React.Fragment>
      <Space direction="vertical" size="middle" className="centered">
        <Form
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
          className="centered"
          initialValues={{ type: "ip" }}
        >
          <Form.Item
            name="type"
            label="Search Type"
            rules={[
              {
                required: true,
                message: "Please select a search type",
              },
            ]}
          >
            <Select>
              <Select.Option value="ip">IP Address</Select.Option>
              <Select.Option value="hostname">Hostname</Select.Option>
              <Select.Option value="mac">MAC Address</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Search String"
            name="search"
            rules={[
              {
                required: true,
                message: "Please input your search string",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit">Search</Button>
          </Form.Item>
        </Form>
        {results && <PrettyPrintJson json={results} />}
      </Space>
    </React.Fragment>
  );
};
