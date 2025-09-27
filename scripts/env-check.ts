export const findMissingKeys = (
  env: Record<string, string | undefined>,
  requiredKeys: readonly string[],
): string[] =>
  requiredKeys.filter((key) => {
    const value = env[key];

    if (value === undefined || value === null) {
      return true;
    }

    return value.trim().length === 0;
  });
