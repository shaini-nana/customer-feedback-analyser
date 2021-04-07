import React  from 'react';
import { Link } from 'react-router-dom';
import { Alert, Form, Input, Button } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { noop } from 'lodash';

import PublicLayout from '../Layout/public-layout';

const Dashboard = () => {

  const authError = {
    isError: false
  };

  const onFinish = async (values) => {
    console.log(`on finish: ${JSON.stringify(values)}`);
  };

  const getOverallAnalytics = () => {
    console.log(`Clicked getOverallAnalytics...`);
  };

  return (
    <PublicLayout errorArea={
      authError.isError && (
        <Alert message="Something went wrong!" description={authError.errorMessage} type="error" showIcon />
      )
    }>
      {/*<h1 className="public-layout-header"> Login </h1>*/}
      <Form name="normal_login" className="login-form" onFinish={onFinish}>
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: 'Please enter your email address',
            },
          ]}
        >
          <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please enter your password',
            },
          ]}
        >
          <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Password" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 10 }}>
          <Button type="primary" htmlType="submit" className="login-form-button" block style={{ fontWeight: 'bold' }}>
            Login
          </Button>
        </Form.Item>

        <Form.Item style={{ textAlign: 'center' }}>
          <Button
            onClick={noop()}
            block
            style={{ marginBottom: 10 }}
          >
            Signup
          </Button>
          <Link
            className="login-form-forgot"
            onClick={noop()}
            to="/ResetPassword"
            style={styles.forgotPassword}
          >
            Forgot password
          </Link>
        </Form.Item>
      </Form>

      <Button
        onClick={getOverallAnalytics()}
        block
        style={{ marginBottom: 10 }}
      >
        TEST BUTTON
      </Button>

    </PublicLayout>
  );
};

const styles = {
  forgotPassword: {},
};

export default Dashboard;
