import express, { NextFunction } from "express"

let requestCount = 0;
let requestsPerSecond = 0;

type THasRequestsPerSecond = {
  requestsPerSecond: number; 
  [key: string]: any; 
};

let requestCounterInterval: NodeJS.Timeout | null = null;

export default (
  args: {
    config: THasRequestsPerSecond
  },
  
) => (req: Request, res: Response, next: NextFunction) => {
  requestCount++;
  if (!requestCounterInterval) {
    requestCounterInterval = setInterval(() => {
      args.config.requestsPerSecond = requestsPerSecond;
    }, 1000);
  }
  setInterval(() => {
    requestsPerSecond = requestCount;
    requestCount = 0;
  }, 1000);
  next();
}