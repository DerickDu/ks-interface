import React from 'react';
import { Layout, Typography, Divider } from 'antd';
import { 
  CopyrightOutlined
} from '@ant-design/icons';
import styles from './Footer.module.css';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <AntFooter className={styles.footer}>
      <div className={styles.footerContent}>
        <Text className={styles.copyrightText}>
          <CopyrightOutlined /> {currentYear} 通信领域知识体系. 保留所有权利.
        </Text>
        <div className={styles.footerLinks}>
          <Link href="#" className={styles.footerLink}>隐私政策</Link>
          <Divider type="vertical" className={styles.divider} />
          <Link href="#" className={styles.footerLink}>使用条款</Link>
          <Divider type="vertical" className={styles.divider} />
          <Link href="#" className={styles.footerLink}>Cookie 设置</Link>
        </div>
      </div>
    </AntFooter>
  );
};

export default Footer;