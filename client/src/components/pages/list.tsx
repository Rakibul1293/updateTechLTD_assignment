import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Button, Typography, message } from 'antd';
import { useHistory } from 'react-router';
import axios from 'axios';

const { Title } = Typography;

const List = () => {
  const history = useHistory();
  const [allData, setAllData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/userInfo')
      .then(res => {
        console.log(res);
        setAllData(res.data);
      })
      .catch(err => {
        console.log(err);
        message.error(err);
      })
  });

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email'
    },
    {
      title: 'Image',
      dataIndex: 'image'
    },
    {
      title: 'Message',
      dataIndex: 'message'
    },
    {
      title: 'Choice',
      dataIndex: 'choice'
    },
  ];

  const data = [{
  }];

  allData.map((user: any) => {
    data.push({
      key: user.id,
      username: user.username,
      email: user.email,
      image: user.image,
      message: user.message,
      choice: user.choice
    })
    return data;
  });

  const handleClick = () => {
    history.push('/form')
  }

  return (
    <div>
      <Row gutter={[40, 0]}>
        <Col span={18}>
          <Title level={2}>
            User List
            </Title>
        </Col>
        <Col span={6}>
          <Button onClick={handleClick} block>Add User</Button>
        </Col>
      </Row>
      <Row gutter={[40, 0]}>
        <Col span={24}>
          <Table columns={columns} dataSource={data} />
        </Col>
      </Row>
    </div>
  );
}

export default List;