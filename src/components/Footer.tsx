import React from 'react';
import { Layout, Typography, Divider } from 'antd';
import { 
  CopyrightOutlined
} from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <AntFooter style={{ background: '#001529', color: 'rgba(255, 255, 255, 0.65)', padding: '20px 50px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <Text style={{ color: 'rgba(255, 255, 255, 0.45)', textAlign: 'center' }}>
          <CopyrightOutlined /> {currentYear} 通信领域知识体系. 保留所有权利.
        </Text>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
          <Link href="#" style={{ color: 'rgba(255, 255, 255, 0.45)' }}>隐私政策</Link>
          <Divider type="vertical" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          <Link href="#" style={{ color: 'rgba(255, 255, 255, 0.45)' }}>使用条款</Link>
          <Divider type="vertical" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          <Link href="#" style={{ color: 'rgba(255, 255, 255, 0.45)' }}>Cookie 设置</Link>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;