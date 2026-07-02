window.OfficeConfig = {
  sessionStorageKey: 'ambassadorOfficeSession',
  loginNextKey: 'ambassadorOfficeNext',
  loginPassword: '123456',
  intercomSignalUrl: 'wss://office-intercom.onrender.com/intercom-signal',
  intercomIceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ],
  accounts: [
    { account: 'ticket', department: '票務部', english: 'TICKETING DEPARTMENT', role: '票務部', extension: '2011' },
    { account: 'floor', department: '場務部', english: 'FLOOR OPERATIONS', role: '場務部', extension: '2001' },
    { account: 'food', department: '餐飲部', english: 'FOOD & BEVERAGE', role: '餐飲部', extension: '3011' },
    { account: 'booth', department: '放映部', english: 'PROJECTION DEPARTMENT', role: '放映部', extension: '4001' },
    { account: 'service', department: '客服部', english: 'CUSTOMER SERVICE', role: '客服部', extension: '1003' },
    { account: 'ops', department: '營運管理部', english: 'OPERATIONS MANAGEMENT', role: '營運管理部', extension: '6001' },
    { account: 'market', department: '行銷部', english: 'MARKETING DEPARTMENT', role: '行銷部', extension: '7001' },
    { account: 'finance', department: '行政財務部', english: 'ADMINISTRATION & FINANCE', role: '行政財務部', extension: '3021' },
    { account: 'security', department: '保全部', english: 'SECURITY DEPARTMENT', role: '保全部', extension: '5001' }
  ],
  contacts: [
    { name: '票務部', role: '票務部', ext: '#2011', tone: '#17c5a7', account: 'ticket', english: 'TICKETING' },
    { name: '場務部', role: '場務部', ext: '#2001', tone: '#62a7ff', account: 'floor', english: 'FLOOR OPS' },
    { name: '餐飲部', role: '餐飲部', ext: '#3011', tone: '#f5a84f', account: 'food', english: 'F&B' },
    { name: '放映部', role: '放映部', ext: '#4001', tone: '#7787ff', account: 'booth', english: 'PROJECTION' },
    { name: '客服部', role: '客服部', ext: '#1003', tone: '#35c7a6', account: 'service', english: 'SERVICE' },
    { name: '營運管理部', role: '營運管理部', ext: '#6001', tone: '#a075ff', account: 'ops', english: 'OPERATIONS' },
    { name: '行銷部', role: '行銷部', ext: '#7001', tone: '#e052a4', account: 'market', english: 'MARKETING' },
    { name: '行政財務部', role: '行政財務部', ext: '#3021', tone: '#e0a33f', account: 'finance', english: 'FINANCE' },
    { name: '保全部', role: '保全部', ext: '#5001', tone: '#ef4b55', account: 'security', english: 'SECURITY' }
  ]
};
