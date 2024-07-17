// page参数
export interface PageVO {
  pageIndex: number;
  pageSize: number;
}

// 实验page参数
export interface PracticePageVO {
  beforeAttention: string;
  beginTime: string;
  catelogId: string;
  catelogName: string;
  classroomId: string;
  endTime: string;
  enterPassword: string;
  finishMan: string;
  finishManId: string;
  finishTime: string;
  finishstatus: number;
  id: number;
  name: string;
  passScore: number;
  points: number;
  publishTime: string;
  publisher: string;
  publisherId: string;
  status: number;
  templateCode: string;
  testPurviewType: string;
  testPurviewTypeId: string;
  totalScore: number;
  updateMan: string;
  updateManId: string;
  updateTime: string;
}
// 实验模版参数
export interface PracticeTemplateVO {
  beDefault: number;
  beMultiple: number;
  beValid: number;
  fileTypes: string;
  id: string;
  itemName: string;
  setKwa: number;
  setWeight: number;
  stuVisible: number;
  templateCode: string;
  weight?: number;
  kwa?:string,
}
