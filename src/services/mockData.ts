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
  },
  // 新增实体 - 用于多层知识结构
  {
    entity_id: 'ENT011',
    entity_name: '毫米波通信',
    description: '使用毫米波段(30-300GHz)进行无线通信的技术，具有大带宽、高速率的特点。',
    validity_result: '有效',
    validity_method: '实验验证',
    created_at: '2023-11-05T09:15:00Z',
    updated_at: '2024-01-10T11:30:00Z'
  },
  {
    entity_id: 'ENT012',
    entity_name: '大规模MIMO',
    description: '大规模多输入多输出技术，通过在基站部署大量天线提高频谱效率和系统容量。',
    validity_result: '有效',
    validity_method: '仿真验证',
    created_at: '2023-11-10T14:20:00Z',
    updated_at: '2024-02-15T16:45:00Z'
  },
  {
    entity_id: 'ENT013',
    entity_name: '波束赋形',
    description: '通过调整天线阵列中各天线单元的信号相位和幅度，形成定向波束的技术。',
    validity_result: '有效',
    validity_method: '理论分析',
    created_at: '2023-11-15T10:30:00Z',
    updated_at: '2024-02-20T13:15:00Z'
  },
  {
    entity_id: 'ENT014',
    entity_name: '网络切片',
    description: '将物理网络划分为多个虚拟网络的技术，为不同应用场景提供定制化的网络服务。',
    validity_result: '有效',
    validity_method: '标准验证',
    created_at: '2023-11-20T11:45:00Z',
    updated_at: '2024-03-01T15:20:00Z'
  },
  {
    entity_id: 'ENT015',
    entity_name: '边缘计算',
    description: '在靠近数据源的边缘侧执行计算任务的技术，降低延迟并减轻中心服务器负担。',
    validity_result: '有效',
    validity_method: '应用验证',
    created_at: '2023-11-25T13:10:00Z',
    updated_at: '2024-03-05T14:35:00Z'
  },
  {
    entity_id: 'ENT016',
    entity_name: '正交频分复用',
    description: '一种多载波调制技术，将高速数据流分解为多个低速子数据流并行传输。',
    validity_result: '有效',
    validity_method: '理论分析',
    created_at: '2023-12-01T09:20:00Z',
    updated_at: '2024-03-10T11:45:00Z'
  },
  {
    entity_id: 'ENT017',
    entity_name: '信道编码',
    description: '在数据传输中添加冗余信息以提高传输可靠性的技术，包括卷积码、Turbo码等。',
    validity_result: '有效',
    validity_method: '实验验证',
    created_at: '2023-12-05T10:30:00Z',
    updated_at: '2024-03-15T12:50:00Z'
  },
  {
    entity_id: 'ENT018',
    entity_name: '自适应调制编码',
    description: '根据信道条件动态调整调制方式和编码速率的技术，提高频谱利用率。',
    validity_result: '有效',
    validity_method: '仿真验证',
    created_at: '2023-12-10T14:15:00Z',
    updated_at: '2024-03-20T16:25:00Z'
  },
  {
    entity_id: 'ENT019',
    entity_name: '载波聚合',
    description: '将多个离散或连续的频段聚合在一起，形成更宽传输带宽的技术。',
    validity_result: '有效',
    validity_method: '标准验证',
    created_at: '2023-12-15T11:40:00Z',
    updated_at: '2024-03-25T13:30:00Z'
  },
  {
    entity_id: 'ENT020',
    entity_name: '双连接技术',
    description: '允许用户设备同时连接到两个不同基站的技术，提高连接可靠性和吞吐量。',
    validity_result: '有效',
    validity_method: '应用验证',
    created_at: '2023-12-20T15:25:00Z',
    updated_at: '2024-03-30T17:10:00Z'
  },
  {
    entity_id: 'ENT021',
    entity_name: '低密度奇偶校验码',
    description: '一种性能接近香农极限的线性纠错码，具有高效的译码算法和良好的误码性能。',
    validity_result: '有效',
    validity_method: '理论分析',
    created_at: '2024-01-05T09:35:00Z',
    updated_at: '2024-04-01T10:45:00Z'
  },
  {
    entity_id: 'ENT022',
    entity_name: '极化码',
    description: '一种能够达到信道容量的编码方案，被5G控制信道采用为标准编码方案。',
    validity_result: '有效',
    validity_method: '标准验证',
    created_at: '2024-01-10T11:20:00Z',
    updated_at: '2024-04-05T12:30:00Z'
  },
  {
    entity_id: 'ENT023',
    entity_name: '网络功能虚拟化',
    description: '将网络功能从专用硬件转移到通用服务器上运行的技术，提高网络灵活性。',
    validity_result: '有效',
    validity_method: '实践验证',
    created_at: '2024-01-15T13:45:00Z',
    updated_at: '2024-04-10T15:55:00Z'
  },
  {
    entity_id: 'ENT024',
    entity_name: '软件定义网络',
    description: '通过分离网络控制平面和数据平面，实现网络可编程化的技术架构。',
    validity_result: '有效',
    validity_method: '理论分析',
    created_at: '2024-01-20T10:15:00Z',
    updated_at: '2024-04-15T11:25:00Z'
  },
  {
    entity_id: 'ENT025',
    entity_name: '服务质量保障',
    description: '确保网络资源分配满足不同应用需求的技术机制，包括带宽、延迟、抖动等指标。',
    validity_result: '有效',
    validity_method: '标准验证',
    created_at: '2024-01-25T14:30:00Z',
    updated_at: '2024-04-20T16:40:00Z'
  },
  {
    entity_id: 'ENT026',
    entity_name: '量子通信技术',
    description: '利用量子力学原理实现信息传输和处理的新型通信技术，具有理论上的绝对安全性。',
    validity_result: '有效',
    validity_method: '理论分析',
    created_at: '2024-02-01T10:15:00Z',
    updated_at: '2024-04-25T14:30:00Z'
  }
];

// Mock目录数据
export const mockCatalogs: Catalog[] = [
  // 原有3层结构
  {
    entity_id: 'ENT001',
    path: '通信/通信技术/5G通信技术',
    domain: '通信',
    subDomain: '通信技术'
  },
  {
    entity_id: 'ENT002',
    path: '通信/通信技术/无线传输技术',
    domain: '通信',
    subDomain: '通信技术'
  },
  {
    entity_id: 'ENT003',
    path: '通信/通信技术/光纤通信',
    domain: '通信',
    subDomain: '通信技术'
  },
  {
    entity_id: 'ENT004',
    path: '通信/通信技术/信号调制技术',
    domain: '通信',
    subDomain: '通信技术'
  },
  {
    entity_id: 'ENT005',
    path: '通信/网络技术/网络协议',
    domain: '通信',
    subDomain: '网络技术'
  },
  {
    entity_id: 'ENT006',
    path: '通信/通信技术/卫星通信',
    domain: '通信',
    subDomain: '通信技术'
  },
  {
    entity_id: 'ENT007',
    path: '通信/网络技术/移动通信网络',
    domain: '通信',
    subDomain: '网络技术'
  },
  {
    entity_id: 'ENT008',
    path: '通信/通信技术/数据编码技术',
    domain: '通信',
    subDomain: '通信技术'
  },
  {
    entity_id: 'ENT009',
    path: '通信/通信技术/天线技术',
    domain: '通信',
    subDomain: '通信技术'
  },
  {
    entity_id: 'ENT010',
    path: '通信/安全/通信安全',
    domain: '通信',
    subDomain: '安全'
  },
  
  // 5层知识结构 - 5G通信技术细分
  {
    entity_id: 'ENT001',
    path: '通信/移动通信/5G技术/无线接入/毫米波通信',
    domain: '通信',
    subDomain: '移动通信'
  },
  {
    entity_id: 'ENT012',
    path: '通信/移动通信/5G技术/无线接入/大规模MIMO',
    domain: '通信',
    subDomain: '移动通信'
  },
  {
    entity_id: 'ENT013',
    path: '通信/移动通信/5G技术/无线接入/波束赋形',
    domain: '通信',
    subDomain: '移动通信'
  },
  {
    entity_id: 'ENT014',
    path: '通信/移动通信/5G技术/网络架构/网络切片',
    domain: '通信',
    subDomain: '移动通信'
  },
  {
    entity_id: 'ENT015',
    path: '通信/移动通信/5G技术/网络架构/边缘计算',
    domain: '通信',
    subDomain: '移动通信'
  },
  {
    entity_id: 'ENT016',
    path: '通信/移动通信/5G技术/物理层技术/正交频分复用',
    domain: '通信',
    subDomain: '移动通信'
  },
  {
    entity_id: 'ENT017',
    path: '通信/移动通信/5G技术/物理层技术/信道编码',
    domain: '通信',
    subDomain: '移动通信'
  },
  {
    entity_id: 'ENT018',
    path: '通信/移动通信/5G技术/物理层技术/自适应调制编码',
    domain: '通信',
    subDomain: '移动通信'
  },
  {
    entity_id: 'ENT019',
    path: '通信/移动通信/5G技术/载波技术/载波聚合',
    domain: '通信',
    subDomain: '移动通信'
  },
  {
    entity_id: 'ENT020',
    path: '通信/移动通信/5G技术/载波技术/双连接技术',
    domain: '通信',
    subDomain: '移动通信'
  },
  
  // 7层知识结构 - 5G物理层技术深度细分
  {
    entity_id: 'ENT021',
    path: '通信/移动通信/5G技术/物理层技术/信道编码/前向纠错/低密度奇偶校验码',
    domain: '通信',
    subDomain: '移动通信'
  },
  {
    entity_id: 'ENT022',
    path: '通信/移动通信/5G技术/物理层技术/信道编码/前向纠错/极化码',
    domain: '通信',
    subDomain: '移动通信'
  },
  {
    entity_id: 'ENT011',
    path: '通信/移动通信/5G技术/物理层技术/无线传输/高频通信/毫米波通信',
    domain: '通信',
    subDomain: '移动通信'
  },
  {
    entity_id: 'ENT012',
    path: '通信/移动通信/5G技术/物理层技术/无线传输/多天线技术/大规模MIMO',
    domain: '通信',
    subDomain: '移动通信'
  },
  {
    entity_id: 'ENT013',
    path: '通信/移动通信/5G技术/物理层技术/无线传输/多天线技术/波束赋形',
    domain: '通信',
    subDomain: '移动通信'
  },
  {
    entity_id: 'ENT016',
    path: '通信/移动通信/5G技术/物理层技术/调制技术/多载波调制/正交频分复用',
    domain: '通信',
    subDomain: '移动通信'
  },
  {
    entity_id: 'ENT018',
    path: '通信/移动通信/5G技术/物理层技术/调制技术/自适应技术/自适应调制编码',
    domain: '通信',
    subDomain: '移动通信'
  },
  {
    entity_id: 'ENT019',
    path: '通信/移动通信/5G技术/物理层技术/频谱利用/带宽扩展/载波聚合',
    domain: '通信',
    subDomain: '移动通信'
  },
  {
    entity_id: 'ENT020',
    path: '通信/移动通信/5G技术/物理层技术/频谱利用/连接技术/双连接技术',
    domain: '通信',
    subDomain: '移动通信'
  },
  
  // 网络架构的多层细分
  {
    entity_id: 'ENT014',
    path: '通信/移动通信/5G技术/网络架构/虚拟化技术/网络功能虚拟化',
    domain: '通信',
    subDomain: '移动通信'
  },
  {
    entity_id: 'ENT024',
    path: '通信/移动通信/5G技术/网络架构/虚拟化技术/软件定义网络',
    domain: '通信',
    subDomain: '移动通信'
  },
  {
    entity_id: 'ENT025',
    path: '通信/移动通信/5G技术/网络架构/服务质量/资源分配/服务质量保障',
    domain: '通信',
    subDomain: '移动通信'
  },
  {
    entity_id: 'ENT015',
    path: '通信/移动通信/5G技术/网络架构/计算架构/分布式计算/边缘计算',
    domain: '通信',
    subDomain: '移动通信'
  },
  
  // 12层深度的知识点路径
  {
    entity_id: 'ENT026',
    path: '通信/前沿通信技术/量子通信/量子密钥分发/BB84协议/量子态制备/单光子源/纠缠光子对/量子信道/量子测量/量子纠错/量子中继',
    domain: '通信',
    subDomain: '前沿通信技术'
  },
  
  // 为某些实体添加多条路径
  {
    entity_id: 'ENT001',
    path: '通信/移动通信/5G通信技术',
    domain: '通信',
    subDomain: '移动通信'
  },
  {
    entity_id: 'ENT002',
    path: '通信/无线通信/无线传输技术',
    domain: '通信',
    subDomain: '无线通信'
  },
  {
    entity_id: 'ENT004',
    path: '通信/信号处理/信号调制技术',
    domain: '通信',
    subDomain: '信号处理'
  },
  {
    entity_id: 'ENT007',
    path: '通信/移动通信/移动通信网络',
    domain: '通信',
    subDomain: '移动通信'
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
  },
  // 新增实体源映射
  {
    source_id: 'SRC011',
    entity_id: 'ENT011'
  },
  {
    source_id: 'SRC012',
    entity_id: 'ENT012'
  },
  {
    source_id: 'SRC013',
    entity_id: 'ENT013'
  },
  {
    source_id: 'SRC014',
    entity_id: 'ENT014'
  },
  {
    source_id: 'SRC015',
    entity_id: 'ENT015'
  },
  {
    source_id: 'SRC016',
    entity_id: 'ENT016'
  },
  {
    source_id: 'SRC017',
    entity_id: 'ENT017'
  },
  {
    source_id: 'SRC018',
    entity_id: 'ENT018'
  },
  {
    source_id: 'SRC019',
    entity_id: 'ENT019'
  },
  {
    source_id: 'SRC020',
    entity_id: 'ENT020'
  },
  {
    source_id: 'SRC021',
    entity_id: 'ENT021'
  },
  {
    source_id: 'SRC022',
    entity_id: 'ENT022'
  },
  {
    source_id: 'SRC023',
    entity_id: 'ENT023'
  },
  {
    source_id: 'SRC024',
    entity_id: 'ENT024'
  },
  {
    source_id: 'SRC025',
    entity_id: 'ENT025'
  },
  // 为某些实体添加多个源
  {
    source_id: 'SRC026',
    entity_id: 'ENT012'
  },
  {
    source_id: 'SRC027',
    entity_id: 'ENT016'
  },
  {
    source_id: 'SRC028',
    entity_id: 'ENT017'
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
  },
  // 新增实体源信息
  {
    source_id: 'SRC011',
    source_type: '技术标准',
    source_ref: '3GPP_TS_38.101_Millimeter_Wave_Spec.pdf',
    created_at: '2023-09-05T10:15:00Z'
  },
  {
    source_id: 'SRC012',
    source_type: '研究论文',
    source_ref: 'Massive_MIMO_Technology_and_Applications_2023.pdf',
    created_at: '2023-09-10T14:30:00Z'
  },
  {
    source_id: 'SRC013',
    source_type: '技术文档',
    source_ref: 'Beamforming_Techniques_in_5G_Systems.docx',
    created_at: '2023-09-15T11:45:00Z'
  },
  {
    source_id: 'SRC014',
    source_type: '行业报告',
    source_ref: 'Network_Slicing_for_5G_Industry_Analysis_2023.pdf',
    created_at: '2023-09-20T16:20:00Z'
  },
  {
    source_id: 'SRC015',
    source_type: '技术白皮书',
    source_ref: 'Edge_Computing_in_5G_Networks_Whitepaper.pdf',
    created_at: '2023-09-25T09:35:00Z'
  },
  {
    source_id: 'SRC016',
    source_type: '教科书',
    source_ref: 'OFDM_Principles_and_Applications_Chapter_5.pdf',
    created_at: '2023-10-01T13:50:00Z'
  },
  {
    source_id: 'SRC017',
    source_type: '研究论文',
    source_ref: 'Channel_Coding_Advances_in_Modern_Communications.pdf',
    created_at: '2023-10-05T15:10:00Z'
  },
  {
    source_id: 'SRC018',
    source_type: '技术规范',
    source_ref: 'Adaptive_Modulation_and_Coding_Spec_v3.pdf',
    created_at: '2023-10-10T12:25:00Z'
  },
  {
    source_id: 'SRC019',
    source_type: '标准文档',
    source_ref: '3GPP_TS_37.340_Carrier_Aggregation.pdf',
    created_at: '2023-10-15T10:40:00Z'
  },
  {
    source_id: 'SRC020',
    source_type: '技术报告',
    source_ref: 'Dual_Connectivity_Technical_Report_2023.docx',
    created_at: '2023-10-20T14:55:00Z'
  },
  {
    source_id: 'SRC021',
    source_type: '学术论文',
    source_ref: 'LDPC_Codes_Performance_Analysis_Research.pdf',
    created_at: '2023-10-25T11:15:00Z'
  },
  {
    source_id: 'SRC022',
    source_type: '技术文档',
    source_ref: 'Polar_Codes_in_5G_Control_Channels.pdf',
    created_at: '2023-10-30T16:30:00Z'
  },
  {
    source_id: 'SRC023',
    source_type: '行业白皮书',
    source_ref: 'NFV_Architecture_and_Implementation_Guide.pdf',
    created_at: '2023-11-05T09:45:00Z'
  },
  {
    source_id: 'SRC024',
    source_type: '技术规范',
    source_ref: 'SDN_Architecture_Standard_2023.pdf',
    created_at: '2023-11-10T13:20:00Z'
  },
  {
    source_id: 'SRC025',
    source_type: '研究论文',
    source_ref: 'QoS_Mechanisms_in_5G_Networks.pdf',
    created_at: '2023-11-15T15:35:00Z'
  },
  {
    source_id: 'SRC026',
    source_type: '实验报告',
    source_ref: 'Massive_MIMO_Performance_Test_Results.xlsx',
    created_at: '2023-11-20T10:50:00Z'
  },
  {
    source_id: 'SRC027',
    source_type: '教科书',
    source_ref: 'Multi_Carrier_Communications_Theory_and_Practice.pdf',
    created_at: '2023-11-25T12:15:00Z'
  },
  {
    source_id: 'SRC028',
    source_type: '技术文档',
    source_ref: 'Advanced_Channel_Coding_Techniques_2023.docx',
    created_at: '2023-11-30T14:40:00Z'
  }
];