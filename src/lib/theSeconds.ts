import ms from "ms";

export const theSeconds = (value: string) => {
  return ms(value) / 1000;
};
