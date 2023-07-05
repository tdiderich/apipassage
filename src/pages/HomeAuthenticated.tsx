import React, { useEffect, useState } from "react";
import { Button, Space, Form, Input, Select } from "antd";
import axios from "axios";

const { TextArea } = Input;
interface SingleSecuritySearchResponse {
  vendor: string;
  data: Object;
}

interface CompleteSecuritySearchResponse {
  data?: SingleSecuritySearchResponse[];
}

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

export const HomeAuthenticated = () => {
  const [loading, setLoading] = useState(false);
  const [results, setSecuritySearchResults] =
    useState<CompleteSecuritySearchResponse>();

  const onFinish = (values: any) => {
    console.log(values.search);
    runSecuritySearch(values.search);
  };

  useEffect(() => {
    console.log(results);
  }, [results]);

  const runSecuritySearch = async (ipAddress: string) => {
    setLoading(true);
    const url = "https://apipassage.com/api/search/ip";
    axios
      .get<CompleteSecuritySearchResponse>(url, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        params: { ipAddress: ipAddress },
      })
      .then((response) => {
        console.log(response.data);
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
      </Space>
      {results && !loading && (
        <TextArea value={JSON.stringify(results, null, 2)} autoSize={true} />
      )}
    </React.Fragment>
  );
};
