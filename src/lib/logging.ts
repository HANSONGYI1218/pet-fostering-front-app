/* eslint-disable no-console */

const shouldLog = process.env.NODE_ENV !== 'production';

export const logWarning = (message: string, ...details: unknown[]) => {
  if (!shouldLog) {
    return;
  }

  console.warn(message, ...details);
};

export const logError = (message: string, ...details: unknown[]) => {
  if (!shouldLog) {
    return;
  }

  console.error(message, ...details);
};
