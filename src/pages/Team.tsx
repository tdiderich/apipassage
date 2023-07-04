import React, { useEffect, useState } from 'react';
import { Button, Space, Form, Input, Select } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { updateTeam, getTeam, TeamType } from '../services/Database';

export const Team = ({ teamUID }: any) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState<TeamType>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getTeam(id).then((team) => {
        console.log(team);
        setTeam(team);
        setLoading(false);
      });
    }
  }, [id]);

  const onFinish = (values: any) => {
    if (
      team?.ownerUID &&
      team.userList &&
      team.users &&
      values.name &&
      values.subscription &&
      id
    ) {
      console.log('attempting update');
      updateTeam({
        name: values.name,
        subscription: values.subscription,
        teamUID: id,
        ownerUID: team.ownerUID,
        userList: team.userList,
        users: team.users
      } as TeamType)
        .then(() => navigate('/teams'))
        .catch((error) => console.log(error));
    }
  };

  const onFinishFailed = (errorFields: any) => {
    console.log(errorFields);
  };

  return (
    <React.Fragment>
      <h3>{loading ? 'Loading team...' : 'Team'}</h3>
      <Space direction="vertical" size="large">
        {!loading && team && (
          <Form
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
            style={{ alignContent: 'center' }}
            disabled={loading ? true : undefined}
            initialValues={{
              name: team.name,
              subscription: team.subscription
            }}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Please add a name'
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="subscription"
              label="Subscription Type"
              rules={[
                {
                  required: true,
                  message: 'Please select an Subscription Type'
                }
              ]}
            >
              <Select>
                <Select.Option value="trial">Trial</Select.Option>
                <Select.Option value="team">Team</Select.Option>
                <Select.Option value="enterprise">Enterprise</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button htmlType="submit">Update Team</Button>
            </Form.Item>
          </Form>
        )}
      </Space>
    </React.Fragment>
  );
};
