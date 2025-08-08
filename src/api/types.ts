export type ApiResponse = {
  status:number;
  message: string;
  value?: number;
};

export type ApiError = {
  status: number;
  message: string;
};