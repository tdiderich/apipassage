import React, { useState, useEffect } from "react";
import { Button, Space, Form, Input, Select } from "antd";
import { getCredentials } from "../services/Database";
import axios from "axios";

const { TextArea } = Input;
interface SingleSecuritySearchResponse {
  vendor: string;
  data: Object;
}

interface CompleteSecuritySearchResponse {
  data?: SingleSecuritySearchResponse[];
}

interface SearchForm {
  type: "ip" | "hostname" | "mac";
  search: string;
}

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

export const HomeAuthenticated = ({ userUID }: any) => {
  const [loading, setLoading] = useState(false);
  const [results, setSecuritySearchResults] = useState<any>();
  const [credentials, setCredentials] = useState([]);

  useEffect(() => {
    getCredentials(userUID).then((credentials) => {
      credentials.forEach((element: any) => {
        element["key"] = element["integrationUID"];
      });
      setLoading(true);
      setCredentials(credentials);
      setLoading(false);
    });
  }, [userUID]);

  const onFinish = async (values: SearchForm) => {
    setLoading(true);
    const url = window.location.href.includes("localhost")
      ? "http://localhost:5001/apipassage/us-central1/search"
      : "https://apipassage.com/api/search";
    axios
      .post<CompleteSecuritySearchResponse>(url, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          credentials: credentials,
        },
        params: {
          type: values.type,
          search: values.search,
          credentials: credentials,
        },
        data: {
          credentials: credentials,
        },
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
            style={{ textAlign: "left" }}
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
      {results &&
        !loading &&
        credentials &&
        credentials.map((cred: { name: string }, i) => {
          if (results[cred.name] !== undefined) {
            return (
              <div key={`search-out-${i}`}>
                <p>{cred.name}</p>
                <TextArea
                  value={JSON.stringify(results[cred.name], null, 2)}
                  autoSize={{ minRows: 2, maxRows: 10 }}
                />
              </div>
            );
          } else {
            return null;
          }
        })}
    </React.Fragment>
  );
};
