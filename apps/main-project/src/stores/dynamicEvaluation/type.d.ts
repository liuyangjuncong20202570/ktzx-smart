export interface courseTarget {
  id: string;
  code: string;
  name: string;
  remark: string;
  courseid: string;
  kwas: Kwa[];
}

export interface Knowledge {
  id: string;
  name: string;
  type: string;
  datavalue: number;
  ordernum: number;
  kwas: Kwa[];
  children_kwas: any[];
  children: any[];
}
export interface KwaDick {
  id: string;
  name: string;
  keywordid: string;
  abilityid: string;
  keywordname: string;
  abilityname: string;
  courseid: string;
  datavalue: number;
  importantlevelid: string;
  status: string;
}

export interface Kwa {
  id: string;
  unitid: string;
  kwaid: string;
  name: string;
  status: number;
}

export interface Kwa {
  id: string;
  name: string;
  keywordid: string;
  abilityid: string;
  keywordname: string;
  abilityname: string;
  courseid: string;
  datavalue: number;
  importantlevelid: string;
}
