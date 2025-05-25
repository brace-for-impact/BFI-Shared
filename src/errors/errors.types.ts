export type DevErrorOptions={
  message: string;
  statusCode?: number;
  [key: string]: any;
}

export type UserErrorOptions={
  message: string;
  statusCode?: number;
  [key: string]: any;
}

export type ValidationErrorOptions={
  message: string;
  statusCode?: number;
  errors?: ValidationErrorItem[];
  [key: string]: any;
}

export type ValidationErrorItem = {
  field?: string;
  message?: string;
};