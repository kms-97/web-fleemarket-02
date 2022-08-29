const amPm = ["오전", "오후"];

export const getParsedDateWithHourMin = (createdAt: Date) => {
  const date = new Date(createdAt);

  const hour = date.getHours() > 12 ? Math.floor(date.getHours() % 12) : date.getHours();
  const min = date.getMinutes();

  return `${amPm[Math.floor(hour / 12)]} ${hour}시 ${min}분`;
};
