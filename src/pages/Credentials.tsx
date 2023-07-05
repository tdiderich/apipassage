import React, { useEffect, useState } from "react";
import { Button, Space, Form, Input, Select, Table } from "antd";
import { createOrUpdateCredential, getCredentials } from "../services/Database";
import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import { Link } from "react-router-dom";

interface DataType {
  key: string;
  name: string;
  integrationUID: string;
  apiKey: string;
  teamUID: string;
  type: string;
  userUID: string;
}

const columns: ColumnsType<DataType> = [
  {
    title: "name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "integrationUID",
    dataIndex: "integrationUID",
    key: "integrationUID",
  },
  {
    title: "apiKey",
    dataIndex: "apiKey",
    key: "apiKey",
  },
  {
    title: "teamUID",
    dataIndex: "teamUID",
    key: "teamUID",
  },
  {
    title: "type",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "userUID",
    dataIndex: "userUID",
    key: "userUID",
  },
  {
    title: "actions",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <Link to={`/credential/${record.integrationUID}`}>Edit</Link>
      </Space>
    ),
  },
];

type UserInfoType = {
  userUID: string;
  teamUID: string;
};

export const Credentials = ({ userUID, teamUID }: UserInfoType) => {
  const [addNew, setAddNew] = useState(false);
  const [credentials, setCredentials] = useState([]);
  const [loading, setLoading] = useState(true);

  const rowSelection: TableRowSelection<DataType> = {
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows,
      );
    },
    onSelect: (record: any, selected: any, selectedRows: any) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

  useEffect(() => {
    getCredentials(userUID).then((credentials) => {
      credentials.forEach((element: any) => {
        element["key"] = element["integrationUID"];
      });
      setLoading(true);
      setCredentials(credentials);
      setLoading(false);
    });
  }, [userUID, addNew]);

  const onFinish = (values: any) => {
    if (values.name && values.type && values.apiKey) {
      createOrUpdateCredential({
        name: values.name,
        type: values.type,
        apiKey: values.apiKey,
        userUID: userUID,
        teamUID: teamUID,
        integrationUID: null,
      })
        .then(() => setAddNew(false))
        .catch((error) => console.log(error));
    }
  };

  const onFinishFailed = (errorFields: any) => {
    console.log(errorFields);
  };

  return (
    <React.Fragment>
      <h3>Credentials</h3>
      {!!addNew && (
        <Space direction="vertical" size="large">
          <Form
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
            style={{ alignContent: "center" }}
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
              <Button htmlType="submit">Add Credential</Button>
            </Form.Item>
          </Form>
        </Space>
      )}
      {!!!addNew && (
        <Space direction="vertical" size="middle">
          <Table
            columns={columns}
            dataSource={credentials}
            loading={loading}
            rowSelection={{ ...rowSelection }}
            pagination={credentials.length > 10 ? undefined : false}
          />
          <Button onClick={() => setAddNew(true)}>Add Credential</Button>
        </Space>
      )}
    </React.Fragment>
  );
};
