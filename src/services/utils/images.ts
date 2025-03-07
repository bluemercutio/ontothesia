export const getRandomImageUrls = (urls: string[], count: number) => {
  const shuffled = [...urls].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
