// requestCounter.ts
import { NextFunction, Request, Response } from "express";

class RequestCounter {
  private requestCount = 0;
  private requestsPerSecond = 0;

  constructor() {
    setInterval(() => {
      this.requestsPerSecond = this.requestCount;
      this.requestCount = 0;
    }, 1000);
  }

  increment() {
    this.requestCount++;
  }

  getRPS() {
    return this.requestsPerSecond;
  }
}

const requestCounter = new RequestCounter();

export const requestCounterMiddleware = (req: Request, res: Response, next: NextFunction) => {
  requestCounter.increment();
  next();
};

export const getRequestsPerSecond = () => requestCounter.getRPS();
