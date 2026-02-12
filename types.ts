
export type AgeGroup = '24-36T' | '3-4T' | '4-5T' | '5-6T';

export enum DevelopmentField {
  THE_CHAT = 'Thể chất',
  NHAN_THUC = 'Nhận thức',
  NGON_NGU = 'Ngôn ngữ',
  TC_XH = 'TC-XH',
  THAM_MY = 'Thẩm mỹ'
}

export interface TeachingMaterial {
  id: string;
  name: string;
  ageGroup: AgeGroup;
  field: DevelopmentField;
  description: string;
  link: string;
  qrCode: string;
  type: 'video' | 'image' | 'file' | 'audio' | 'word' | 'excel' | 'pdf';
  isKidProduct?: boolean; // Thuộc tính mới để phân biệt SP của trẻ
}

export type ViewState = 'HOME' | 'AGE_FIELDS' | 'LIST' | 'DETAIL' | 'FAVORITES' | 'ADD_MATERIAL';
