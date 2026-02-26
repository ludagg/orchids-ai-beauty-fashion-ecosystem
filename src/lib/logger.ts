import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

const logger = pino({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  transport: isDevelopment
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
  base: {
    env: process.env.NODE_ENV,
    version: process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0',
  },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers["x-api-key"]',
      'req.body.password',
      'req.body.token',
      'req.body.email',
      'req.body.phone',
      'res.body.token',
      'user.email',
      'user.phone',
      '*.email',
      '*.phone',
      'email',
      'phone',
      'password',
      'token',
      'apiKey',
      'secret',
      'creditCard',
      'cardNumber',
      'cvv',
      'ssn',
      'ip',
      'userAgent',
    ],
    remove: true,
  },
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
    bindings: (bindings) => {
      return isProduction ? {} : bindings;
    },
    log: (obj) => {
      if (isProduction && obj.req) {
        const { req, ...rest } = obj;
        return {
          ...rest,
          req: {
            method: req.method,
            url: req.url,
          },
        };
      }
      return obj;
    },
  },
});

export function createRequestLogger(req?: { method?: string; url?: string; headers?: Record<string, unknown> }) {
  const childLogger = logger.child({
    req: req
      ? {
          method: req.method,
          url: req.url,
        }
      : undefined,
  });

  return {
    debug: (msg: string, meta?: Record<string, unknown>) => {
      if (!isProduction) childLogger.debug(meta || {}, msg);
    },
    info: (msg: string, meta?: Record<string, unknown>) => {
      childLogger.info(meta || {}, msg);
    },
    warn: (msg: string, meta?: Record<string, unknown>) => {
      childLogger.warn(meta || {}, msg);
    },
    error: (msg: string, error?: Error | unknown, meta?: Record<string, unknown>) => {
      const errorMeta = error instanceof Error 
        ? { error: error.message, stack: isProduction ? undefined : error.stack }
        : { error };
      childLogger.error({ ...meta, ...errorMeta }, msg);
    },
  };
}

export const log = {
  debug: (msg: string, meta?: Record<string, unknown>) => {
    if (!isProduction) logger.debug(meta || {}, msg);
  },
  info: (msg: string, meta?: Record<string, unknown>) => {
    logger.info(meta || {}, msg);
  },
  warn: (msg: string, meta?: Record<string, unknown>) => {
    logger.warn(meta || {}, msg);
  },
  error: (msg: string, error?: Error | unknown, meta?: Record<string, unknown>) => {
    const errorMeta = error instanceof Error 
      ? { error: error.message, stack: isProduction ? undefined : error.stack }
      : { error };
    logger.error({ ...meta, ...errorMeta }, msg);
  },
};

export default logger;
