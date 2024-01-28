export function safeParseJSON(rawData: unknown): Record<string, unknown> | null {
  try {
    if (typeof rawData === 'string') {
      return JSON.parse(rawData);
    }
  } catch (error) {
    console.error('Failed to parse JSON: ', error);
  }
  return null;
}
