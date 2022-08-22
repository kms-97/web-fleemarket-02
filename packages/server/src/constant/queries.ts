const AUTH_QUERY = {
  FIND_REFRESH_TOKEN: `
    select a.refresh_token as refreshToken
    from Auth a
    where a.refresh_token = ?
  `,
  FIND_REFRESH_TOKEN_BY_USER_ID: `
  select a.refresh_token as refreshToken
  from Auth a 
  where a.user_id = ?
  `,
  UPDATE_REFRESH_TOKEN: (refreshToken: string | null) => `
    update Auth set refresh_token = "${refreshToken}"
    where user_id = ?
    `,
  INSERT_REFRESH_TOKEN: `
    insert into Auth (user_id, refresh_token) 
    values (?, ?)
    `,
};

export { AUTH_QUERY };
