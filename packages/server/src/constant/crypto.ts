export const jwtConstants = {
  secret: process.env.JWT_SECRET_KEY,
  header: process.env.JWT_HEADER,
};

export const secretContents = {
  login: process.env.LOGIN_SECRET_KEY,
};
