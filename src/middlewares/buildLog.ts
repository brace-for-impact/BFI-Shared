import { Request, Response } from 'express';
import { ApiLoggerConfig } from './middlewares.types';
import { logFields } from './logFields';
import morgan from 'morgan';

export function buildLog(
  context: 'entry' | 'exit',
  config: ApiLoggerConfig,
  req: Request,
  res: Response,
  tokens?: morgan.TokenIndexer<Request, Response>
): string | null {
  const parts = logFields
    .filter(field => config[field.key])
    .map(field => {
      const val = field.resolver(context, req, res, tokens);
      return val ? `${field.label}: ${val}` : null;
    })
    .filter(Boolean);

  return parts.length ? `[API ${context === 'entry' ? 'Entry' : 'Exit'}] ${parts.join(' | ')}` : null;
}
