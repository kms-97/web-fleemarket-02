function checkEnAndNum(value: string) {
  const reg = /^[A-Za-z0-9]/;
  return !reg.test(value) ? "영문, 한글만 입력 가능합니다." : "";
}

function checkLengthByValue(value: string) {
  if (value.length === 0) {
    return "";
  }

  const isNotNumberOrEn = checkEnAndNum(value);

  if (isNotNumberOrEn.length > 0) {
    return isNotNumberOrEn;
  }

  if (value.length < 5) {
    return "5글자 이상 입력해주세요.";
  }

  return "";
}

function checkConfirmPassword(password: string, cPassword: string) {
  if (cPassword.length === 0 || password.length === 0) {
    return "";
  }

  return cPassword !== password ? "비밀번호가 일치하지 않습니다." : "";
}

export { checkLengthByValue, checkConfirmPassword, checkEnAndNum };
