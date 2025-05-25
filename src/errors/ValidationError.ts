import { AppError } from './AppError';
import { ValidationErrorOptions } from './errors.types';

export default class ValidationError extends AppError {
  public errors: any[];
  public metadata: Record<string, any>;

  constructor(options: ValidationErrorOptions) {
    const {
      message,
      statusCode = 422,
      errors = [],
      ...metadata
    } = options;

    super(message, statusCode, true);
    this.errors = errors;
    this.metadata = metadata;
  }
}
