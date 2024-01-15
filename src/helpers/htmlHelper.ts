export const containsHtml = (str: string): boolean => {
  return /<[a-z][\s\S]*>/i.test(str);
};
