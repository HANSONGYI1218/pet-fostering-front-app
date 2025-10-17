export const logFallbackWarning = (message: string, error: unknown) => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn(message, error);
  }
};
