export interface Response {
  status: number;
  success: boolean;
  data?: any;
  message?: {
    title: string;
    description: string;
  };
}

export interface Prompt {
  id: string;
  content: JSX.Element | undefined;
}
