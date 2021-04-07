import React from 'react';
import { Row, Col } from 'antd';

import './styles.css';

const PublicLayout = ({ children, errorArea }) => {
  return (
    <Row className="public-container">
      <Col xs={{ span: 6, offset: 9 }} md={{ span: 4, offset: 10 }}>
        <img src="/j-logo.png" className="logo" />
        {children}
      </Col>
      <Col xs={{ span: 8, offset: 8 }} md={{ span: 6, offset: 9 }}>
        {errorArea}
      </Col>
      <Col span={24} style={{ position: 'absolute', bottom: 20, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '12px' }}>
          Design and Developed by{' '}
          <a href="" style={{ color: '#ef2c23', fontWeight: 'bold' }}>
            SA
          </a>{' '}
          &{' '}
          <a href="" style={{ color: '#305581', fontWeight: 'bold' }}>
            TS
          </a>
        </div>
      </Col>
    </Row>
  );
};

export default PublicLayout;
