// page参数
export interface PageVO {
  pageIndex: number;
  pageSize: number;
}
export interface StudentPageVO extends PageVO{
  practiceId: string;
}
export interface ResVO {
  code: string;
  data?: any;
  message:string,
  result:boolean
}
export interface StudentPracticePageVO {
  stuNo:string;
  name:string;
  answerPercent:number | string;
  status:number | string;
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
  fullName:string,
  kwaId?:string
  kwaName?:string
}

export interface KwaVO {
  abilityList: Array<any>;
  keyId: string;
  name: string;
}
export interface KwaDataVO {
  key:string;
  ability: string;
}

export interface ParamVO {
  beDefault?: number,
  beValid?: number,
  defaultPath?: "string",
  id?: "string",
  itemName?: "string",
  kwas?: Array<any>,
  practiceId?: "string",
  stuVisible?: number,
  weight?: number,
}
export interface DefaultParamVO  {
  id?:string,
  items:Array<ParamVO>,
  name?:string,
  templateCode?:string,
  totalScore?:number
}

export interface KwaParamVO  {
  id?:string,
  itemId:string,
  kwaId:string,
  kwaName:string,
  practiceId:string
}

export interface StudentParamVO  {
  practiceId:string,
  stuId:string
}