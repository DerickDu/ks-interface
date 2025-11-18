import type { Entity, Catalog, EntitySource, EntitySourceMap } from '../types';

// Mock实体数据
export const mockEntities: Entity[] = [
  {
    entity_id: 'ENT001',
    entity_name: '5G通信技术',
    description: '第五代移动通信技术，是最新一代蜂窝移动通信技术，也是继4G（LTE-A）、3G（UMTS）和2G（GSM）系统之后的延伸。',
    validity_result: '有效',
    validity_method: '专家评审',
    created_at: '2023-01-15T08:30:00Z',
    updated_at: '2023-06-20T14:22:00Z'
  },
  {
    entity_id: 'ENT002',
    entity_name: '无线传输技术',
    description: '通过电磁波在空间中传输信息的技术，包括无线电波、微波、红外线等多种传输方式。',
    validity_result: '有效',
    validity_method: '技术验证',
    created_at: '2023-02-10T10:15:00Z',
    updated_at: '2023-07-05T16:45:00Z'
  },
  {
    entity_id: 'ENT003',
    entity_name: '光纤通信',
    description: '利用光波在光导纤维中传输信息的通信方式，具有传输容量大、损耗低、抗干扰能力强等优点。',
    validity_result: '有效',
    validity_method: '实验验证',
    created_at: '2023-03-05T09:20:00Z',
    updated_at: '2023-08-12T11:30:00Z'
  },
  {
    entity_id: 'ENT004',
    entity_name: '信号调制技术',
    description: '将信息信号转换为适合在信道中传输的信号形式的技术，包括调幅、调频、调相等基本方式。',
    validity_result: '有效',
    validity_method: '理论分析',
    created_at: '2023-04-12T13:45:00Z',
    updated_at: '2023-09-18T15:10:00Z'
  },
  {
    entity_id: 'ENT005',
    entity_name: '网络协议',
    description: '计算机网络中用于规定数据交换格式、时序和规则的约定，是网络通信的基础。',
    validity_result: '有效',
    validity_method: '标准验证',
    created_at: '2023-05-20T11:30:00Z',
    updated_at: '2023-10-25T09:40:00Z'
  },
  {
    entity_id: 'ENT006',
    entity_name: '卫星通信',
    description: '利用人造地球卫星作为中继站转发无线电信号，实现两个或多个地球站之间的通信。',
    validity_result: '有效',
    validity_method: '应用验证',
    created_at: '2023-06-08T14:15:00Z',
    updated_at: '2023-11-30T12:25:00Z'
  },
  {
    entity_id: 'ENT007',
    entity_name: '移动通信网络',
    description: '支持移动用户在移动中通信的网络系统，包括基站、交换中心、移动终端等组成部分。',
    validity_result: '有效',
    validity_method: '实践验证',
    created_at: '2023-07-14T10:20:00Z',
    updated_at: '2023-12-10T16:35:00Z'
  },
  {
    entity_id: 'ENT008',
    entity_name: '数据编码技术',
    description: '将数据转换为特定格式以便于传输和存储的技术，包括信源编码和信道编码两大类。',
    validity_result: '有效',
    validity_method: '理论分析',
    created_at: '2023-08-22T09:45:00Z',
    updated_at: '2024-01-15T13:20:00Z'
  },
  {
    entity_id: 'ENT009',
    entity_name: '天线技术',
    description: '用于发射和接收电磁波的装置技术，是无线通信系统的重要组成部分。',
    validity_result: '有效',
    validity_method: '实验验证',
    created_at: '2023-09-30T12:10:00Z',
    updated_at: '2024-02-20T10:50:00Z'
  },
  {
    entity_id: 'ENT010',
    entity_name: '通信安全',
    description: '保护通信系统和信息免受未经授权的访问、使用、披露、破坏、修改或者销毁的技术和管理措施。',
    validity_result: '有效',
    validity_method: '标准验证',
    created_at: '2023-10-18T15:30:00Z',
    updated_at: '2024-03-05T14:15:00Z'
  }
];

// Mock目录数据
export const mockCatalogs: Catalog[] = [
  {
    entity_id: 'ENT001',
    path: '通信/通信技术/5G通信技术',
    domain: '通信'
  },
  {
    entity_id: 'ENT002',
    path: '通信/通信技术/无线传输技术',
    domain: '通信'
  },
  {
    entity_id: 'ENT003',
    path: '通信/通信技术/光纤通信',
    domain: '通信'
  },
  {
    entity_id: 'ENT004',
    path: '通信/通信技术/信号调制技术',
    domain: '通信'
  },
  {
    entity_id: 'ENT005',
    path: '通信/网络技术/网络协议',
    domain: '通信'
  },
  {
    entity_id: 'ENT006',
    path: '通信/通信技术/卫星通信',
    domain: '通信'
  },
  {
    entity_id: 'ENT007',
    path: '通信/网络技术/移动通信网络',
    domain: '通信'
  },
  {
    entity_id: 'ENT008',
    path: '通信/通信技术/数据编码技术',
    domain: '通信'
  },
  {
    entity_id: 'ENT009',
    path: '通信/通信技术/天线技术',
    domain: '通信'
  },
  {
    entity_id: 'ENT010',
    path: '通信/安全/通信安全',
    domain: '通信'
  },
  // 为某些实体添加多条路径
  {
    entity_id: 'ENT001',
    path: '通信/移动通信/5G通信技术',
    domain: '通信'
  },
  {
    entity_id: 'ENT002',
    path: '通信/无线通信/无线传输技术',
    domain: '通信'
  },
  {
    entity_id: 'ENT004',
    path: '通信/信号处理/信号调制技术',
    domain: '通信'
  },
  {
    entity_id: 'ENT007',
    path: '通信/移动通信/移动通信网络',
    domain: '通信'
  }
];

// Mock实体源映射数据 (Entities Source Map)
export const mockEntitySourceMaps: EntitySourceMap[] = [
  {
    source_id: 'SRC001',
    entity_id: 'ENT001'
  },
  {
    source_id: 'SRC002',
    entity_id: 'ENT001'
  },
  {
    source_id: 'SRC003',
    entity_id: 'ENT002'
  },
  {
    source_id: 'SRC004',
    entity_id: 'ENT003'
  },
  {
    source_id: 'SRC005',
    entity_id: 'ENT003'
  },
  {
    source_id: 'SRC006',
    entity_id: 'ENT004'
  },
  {
    source_id: 'SRC007',
    entity_id: 'ENT005'
  },
  {
    source_id: 'SRC008',
    entity_id: 'ENT006'
  },
  {
    source_id: 'SRC009',
    entity_id: 'ENT007'
  },
  {
    source_id: 'SRC010',
    entity_id: 'ENT008'
  }
];

// Mock实体源信息数据 (Entities Source)
export const mockEntitySources: EntitySource[] = [
  {
    source_id: 'SRC001',
    source_type: '技术文档',
    source_ref: '5G_NR_PHY_Layer_Spec.pdf',
    created_at: '2023-01-10T09:00:00Z'
  },
  {
    source_id: 'SRC002',
    source_type: '学术论文',
    source_ref: '5G_Network_Architecture_and_Performance_Analysis.docx',
    created_at: '2023-01-12T14:30:00Z'
  },
  {
    source_id: 'SRC003',
    source_type: '技术规范',
    source_ref: 'Wireless_Transmission_Techniques_Standard_v2.pdf',
    created_at: '2023-02-05T11:15:00Z'
  },
  {
    source_id: 'SRC004',
    source_type: '专利文献',
    source_ref: 'Fiber_Optic_Communication_Method_Patent_2023.docx',
    created_at: '2023-03-01T10:45:00Z'
  },
  {
    source_id: 'SRC005',
    source_type: '实验报告',
    source_ref: 'Fiber_Optics_Transmission_Efficiency_Test_Report.xlsx',
    created_at: '2023-03-03T16:20:00Z'
  },
  {
    source_id: 'SRC006',
    source_type: '教科书',
    source_ref: 'Digital_Communications_Textbook_Chapter_7.pdf',
    created_at: '2023-04-08T09:30:00Z'
  },
  {
    source_id: 'SRC007',
    source_type: '行业标准',
    source_ref: 'Network_Protocol_Standards_ISO_27001.docx',
    created_at: '2023-05-15T13:40:00Z'
  },
  {
    source_id: 'SRC008',
    source_type: '技术白皮书',
    source_ref: 'Satellite_Communication_Technology_Whitepaper_2023.pdf',
    created_at: '2023-06-05T15:25:00Z'
  },
  {
    source_id: 'SRC009',
    source_type: '会议记录',
    source_ref: 'Mobile_Network_Design_Workshop_Minutes_2023.docx',
    created_at: '2023-07-10T11:50:00Z'
  },
  {
    source_id: 'SRC010',
    source_type: '研究论文',
    source_ref: 'Data_Encoding_Algorithms_for_Modern_Communications.pdf',
    created_at: '2023-08-18T14:10:00Z'
  }
];