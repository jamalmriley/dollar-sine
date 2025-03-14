export interface Response {
  status: number;
  success: boolean;
  data?: any;
  message?: {
    title: string;
    description: string;
  };
}
