export interface Parameter {
  key: string;
  type: string;
  description: string;
  value?: any;
  mandatory?: boolean;
  default?: any;
}