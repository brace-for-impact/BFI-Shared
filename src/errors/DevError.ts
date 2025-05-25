import { AppError } from './AppError';
import {DevErrorOptions} from "./errors.types"



export default class DevError extends AppError {
  public metadata: Record<string, any>;

  constructor(options: DevErrorOptions) {
    const { message, statusCode = 500, ...metadata } = options;
    super(message, statusCode, true);
    this.metadata = metadata;
  }
}
