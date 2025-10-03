export interface Category {
  id: string;
  courseId: string;
  categoryName: string;
  categoryDescription: string;
  score: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AimType {
  id: string;
  courseId: string;
  objectiveName: string;
  objectiveDescription: string;
  weight: number;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface newInfo {
  head: Category[];
  items: AimType[];
}

export interface collumnItem {
  field: string;
  title: string;
  width: number;
}
