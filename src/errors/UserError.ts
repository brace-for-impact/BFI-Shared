import { AppError } from './AppError';
import { UserErrorOptions } from './errors.types';

export default class UserError extends AppError {
  public metadata: Record<string, any>;

  constructor(options: UserErrorOptions) {
    const { message, statusCode = 400, ...metadata } = options;
    super(message, statusCode, true);
    this.metadata = metadata;
  }
}
