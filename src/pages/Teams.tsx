import React, { useEffect, useState } from "react";
import { Button, Space, Form, Input, Table } from "antd";
import { addTeam, getTeams, TeamType } from "../services/Database";
import type { ColumnsType } from "antd/es/table";
import type { TableRowSelection } from "antd/es/table/interface";
import { Link } from "react-router-dom";

interface TeamDataType {
  key: string;
  name: string;
  teamUID: string;
  subscription: string;
}

const columns: ColumnsType<TeamDataType> = [
  {
    title: "name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "role",
    dataIndex: "role",
    key: "role",
  },
  {
    title: "subscription",
    dataIndex: "subscription",
    key: "subscription",
  },
  {
    title: "actions",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <Link to={`/team/${record.teamUID}`}>Edit</Link>
      </Space>
    ),
  },
];

export const Teams = ({ userUID }: any) => {
  const [addNew, setAddNew] = useState(false);
  const [teams, setTeams] = useState<TeamDataType[]>([]);
  const [loading, setLoading] = useState(true);

  const rowSelection: TableRowSelection<TeamDataType> = {
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
    getTeams(userUID).then((teams) => {
      teams.forEach((element: any) => {
        element["key"] = element["teamUID"];
      });
      setLoading(true);
      setTeams(teams);
      setLoading(false);
    });
  }, [userUID, addNew]);

  const onFinish = (values: any) => {
    if (values.name) {
      addTeam({
        name: values.name as string,
        subscription: "trial",
        ownerUID: userUID,
        userList: [userUID],
        users: [],
        teamUID: undefined,
      } as TeamType)
        .then(() => setAddNew(false))
        .catch((error) => console.log(error));
    }
  };

  const onFinishFailed = (errorFields: any) => {
    console.log(errorFields);
  };

  return (
    <React.Fragment>
      <h3>Teams</h3>
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
            <Form.Item>
              <Button htmlType="submit">Add Team</Button>
            </Form.Item>
          </Form>
        </Space>
      )}
      {!!!addNew && (
        <Space direction="vertical" size="middle">
          <Table
            columns={columns}
            dataSource={teams}
            loading={loading}
            rowSelection={{ ...rowSelection }}
            pagination={teams.length > 10 ? undefined : false}
          />
          <Button onClick={() => setAddNew(true)}>Add Team</Button>
        </Space>
      )}
    </React.Fragment>
  );
};
