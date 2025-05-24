import { Request, Response } from 'express';
import { ApiLoggerConfig } from './middlewares.types';
import morgan from 'morgan';

type FieldContext = 'entry' | 'exit';

export interface LogField {
  key: keyof ApiLoggerConfig;
  label: string;
  resolver: (context: FieldContext, req: Request, res: Response, tokens?: morgan.TokenIndexer<Request, Response>) => string | null;
}

export const logFields: LogField[] = [
  {
    key: 'logHttpMethod',
    label: 'Method',
    resolver: (_, req) => req.method,
  },
  {
    key: 'logRequestUrl',
    label: 'URL',
    resolver: (_, req) => req.originalUrl,
  },
  {
    key: 'logRequestHeaders',
    label: 'Headers',
    resolver: (context, req) => context === 'entry' ? JSON.stringify(req.headers) : null,
  },
  {
    key: 'logRequestBody',
    label: 'Body',
    resolver: (context, req) => context === 'entry' && req.body ? JSON.stringify(req.body) : null,
  },
  {
    key: 'logStatusCode',
    label: 'Status',
    resolver: (context, _, res, tokens) =>
      context === 'exit' && tokens ? tokens.status(_, res) : null,
  },
  {
    key: 'logResponseTime',
    label: 'Response Time',
    resolver: (context, _, res, tokens) =>
      context === 'exit' && tokens ? `${tokens['response-time'](_, res)} ms` : null,
  },
];
