import { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import { ApiLoggerConfig } from './middlewares.types';
import { buildLog } from './buildLog';

const apiLogger = (config: ApiLoggerConfig = {}) => (req: Request, res: Response, next: NextFunction) => {
  const morganLogger = morgan((tokens, req, res) => {
    const message = buildLog('exit', config, req, res, tokens);
    return message ?? '';
  });
  const entryLog = buildLog('entry', config, req, res);
    if (entryLog) console.log(entryLog + '\n');
    morganLogger(req, res, next);
}

export default apiLogger