const NINE_HOURS = 1000 * 60 * 60 * 9;

export const getExpriedTime = (createdAt: Date) => {
  const today = new Date();
  const timeValue = new Date(createdAt);

  const betweenTime = Math.floor(
    (today.getTime() - (timeValue.getTime() - NINE_HOURS)) / 1000 / 60,
  );
  if (betweenTime < 1) return "방금전";
  if (betweenTime < 60) {
    return `${betweenTime}분전`;
  }

  const betweenTimeHour = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}시간전`;
  }

  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
  if (betweenTimeDay < 365) {
    return `${betweenTimeDay}일전`;
  }

  return `${Math.floor(betweenTimeDay / 365)}년전`;
};
