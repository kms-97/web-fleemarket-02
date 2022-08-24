export const getQueryParams = <T extends Record<string, string>>(query: T) => {
  const params = new URLSearchParams({ ...query });

  return params.toString();
};
