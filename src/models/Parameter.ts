export interface Parameter {
  key: string;
  type: string;
  description: string;
  category: number;
  value?: any;
  mandatory?: boolean;
}