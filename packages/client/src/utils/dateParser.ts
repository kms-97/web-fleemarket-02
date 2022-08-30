export const getParsedDateWithHourMin = (createdAt: Date) => {
  const date = new Date(createdAt);

  const hour = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
  const min = date.getMinutes();
  const amPm = date.getHours() > 12 ? "오후" : "오전";

  return `${amPm} ${hour}시 ${min}분`;
};
