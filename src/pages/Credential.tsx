import React, { useEffect, useState } from "react";
import { Button, Space, Form, Input, Select } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import {
  createOrUpdateCredential,
  getCredential,
  CredentialType,
} from "../services/Database";

type CredentialFormValues = {
  name: string;
  type: "virus-total" | "ip-info" | "runzero";
  apiKey: string;
};

export const Credential = ({ userUID, teamUID }: any) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [credential, setCredential] = useState<CredentialType>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCredential(id).then((credential) => {
      console.log(credential);
      setCredential(credential);
      setLoading(false);
    });
  }, [id]);

  const onFinish = (values: CredentialFormValues) => {
    if (
      credential?.userUID &&
      credential?.teamUID &&
      values.name &&
      values.type &&
      values.apiKey &&
      id
    ) {
      createOrUpdateCredential({
        name: values.name,
        type: values.type,
        apiKey: values.apiKey,
        userUID: credential.userUID,
        teamUID: credential.teamUID,
        integrationUID: id,
      })
        .then(() => navigate("/credentials"))
        .catch((error) => console.log(error));
    }
  };

  const onFinishFailed = (errorFields: any) => {
    console.log(errorFields);
  };

  return (
    <React.Fragment>
      <h3>{loading ? "Loading credential..." : "Credential"}</h3>
      <Space direction="vertical" size="large">
        {!loading && credential && (
          <Form
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
            style={{ alignContent: "center" }}
            disabled={loading ? true : undefined}
            initialValues={{
              name: credential.name,
              apiKey: credential.apiKey,
              type: credential.type,
            }}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please add a name",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="type"
              label="Integration Type"
              rules={[
                {
                  required: true,
                  message: "Please select an Integration Type",
                },
              ]}
            >
              <Select>
                <Select.Option value="ip-info">IPInfo</Select.Option>
                <Select.Option value="virus-total">VirusTotal</Select.Option>
                <Select.Option value="runzero">runZero</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="API Key"
              name="apiKey"
              rules={[
                {
                  required: true,
                  message: "Please add API Key",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button htmlType="submit">Update Credential</Button>
            </Form.Item>
          </Form>
        )}
      </Space>
    </React.Fragment>
  );
};
