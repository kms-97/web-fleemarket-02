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

const CATEGORY_QUERY = {
  GET_CATEGORIES: `select id, name, imgUrl from Category`,
  GET_CATEGORY_BY_NAME: `select id, name from Category where name = ?`,
  GET_CATEGORY_BY_ID: `select id, name from Category where id = ?`,
};

const LOCATION_QUERY = {
  FIND_LOCATION_BY_KEYWORD: `
    select id, sido, gungu, dong, code
    from (select CONCAT(sido, ' ', gungu, ' ', dong) as name, id, sido, gungu, dong, code from Location ) l
    where l.name like ? and l.id > ?
    limit 0, 20
    `,
  FIND_LOCATION_BY_CODE: `
    select id, sido, gungu, dong, code from Location l
    where l.code like ?
    limit ?, ?
    `,
  GET_LOCATION_BY_CODE: `
    select id, sido, gungu, dong, code from Location l
    where l.code = ?
    `,
  GET_LOCATION_BY_ID: `
    select id, sido, gungu, dong, code from Location l
    where l.id = ?
    `,
};

const PRODUCT_QUERY = {
  GET_PRODUCT_DETAIL_BY_ID: `
    select p.id as id, title, description, price, p.imgUrl as imgUrl, status, hits, p.createdAt as createdAt,
          json_object('id', l.id, 'code', l.code, 'dong', l.dong) as location,
          json_object('id', c.id, 'name', c.name) as category,
          json_object('id', u.id, 'userId', u.user_id, 'name', u.name) as seller,
          if(count(w.id) = 0, json_array(), json_arrayagg(w.user_id)) as likeUsers,
          if(count(cr.id) = 0, json_array(), json_arrayagg(json_object('id', cr.id, 'sellerId', cr.sellerId, 'buyerId', cr.buyerId, 'deleteUserId', cr.deleteUserId))) as chatRooms
    from Product p
    left join ChatRoom cr on cr.productId = p.id
    join Location l on p.location_id = l.id
    join User u on u.id = p.seller_id
    join Category c on c.name = p.category_name
    left join Wish w on w.product_id = p.id
    where p.id = ?;
    `,
  INSERT_PRODUCT: `
    insert into Product (title, description, price, imgUrl, location_id, seller_id, category_name)
    values (?, ?, ?, ?, ?, ?, ?)
    `,
  UPDATE_PRODUCT: `
    update Product
    set title = ?, description = ?, price = ?, imgUrl = ?, location_id = ?, seller_id = ?, category_name = ?
    where id = ?
    `,
  UPDATE_PRODUCT_STATUS: `
    update Product
    set status = ?
    where id = ?
    `,
  DELETE_PRODUCT: `
    delete from Product where id = ?
    `,
  FIND_PRODUCT_BY_CATEGORY: `
    select p.id as id, title, imgUrl, price, l.dong as locationName, category_name as categoryName, seller_id as sellerId, p.createdAt as createdAt,
      if (count(w.id) = 0, json_array(), json_arrayagg(w.user_id)) as likeUsers
    from Product p
    join Location l on p.location_id = l.id
    left join Wish w on w.product_id = p.id
    where p.category_name = ? and p.location_id = ?
    group by p.id
    order by p.createdAt desc;
    `,
  FIND_PRODUCT_BY_LOCATION: `
    select p.id as id, title, imgUrl, price, l.dong as locationName, category_name as categoryName, seller_id as sellerId, p.createdAt as createdAt,
      if (count(w.id) = 0, json_array(), json_arrayagg(w.user_id)) as likeUsers
    from Product p
    join Location l on p.location_id = l.id
    left join Wish w on w.product_id = p.id
    where p.location_id = ?
    group by p.id
    order by p.createdAt desc;
    `,
  FIND_PRODUCT_BY_SELLER_ID: `
    select p.id as id, title, imgUrl, price, l.dong as locationName, category_name as categoryName, seller_id as sellerId, p.createdAt as createdAt,
      if (count(w.id) = 0, json_array(), json_arrayagg(w.user_id)) as likeUsers
    from Product p
    join Location l on p.location_id = l.id
    left join Wish w on w.product_id = p.id
    where p.seller_id = ?
    group by p.id
    order by p.createdAt desc;
    `,
  GET_PRODUCT_BY_ID: `select * from Product where id = ? order by Product.createdAt desc`,
};

const USER_QUERY = {
  INSERT_USER: `
    insert into User (user_id, name, password, github)
    values (?, ?, ?, ?)
    `,
  GET_USER_BY_ID: `
    select u.id, u.user_id as userId, u.name as name,
          json_arrayagg(json_object('id', l.id, 'dong', l.dong, 'code', l.code, 'isActive', l.is_active)) as locations,
          (select if (count(w.id) = 0, json_array(), json_arrayagg(w.product_id))
          from Wish w
          where w.user_id = u.id) as wishes,
          u.github as github
    from User u
    left join (select l.id as id, ul.user_id as user_id, l.code as code, l.dong as dong, ul.is_active as is_active
              from UserLocation ul
              join Location l on ul.location_id = l.id) as l on u.id = l.user_id
    where u.id = ?;
    `,
  GET_USER_BY_USER_ID: `
    select u.id, u.user_id as userId, u.name as name,
          json_arrayagg(json_object('id', l.id, 'dong', l.dong, 'code', l.code, 'isActive', l.is_active)) as locations,
          (select if (count(w.id) = 0, json_array(), json_arrayagg(w.product_id))
          from Wish w
          where w.user_id = u.id) as wishes
    from User u
    left join (select l.id as id, ul.user_id as user_id, l.code as code, l.dong as dong, ul.is_active as is_active
              from UserLocation ul
              join Location l on ul.location_id = l.id) as l on u.id = l.user_id
    where u.user_id = ?;
    `,
  GET_USER_BY_GITHUB_EMAIL: `
    select u.id, u.user_id as userId, u.name as name,
          json_arrayagg(json_object('id', l.id, 'dong', l.dong, 'code', l.code)) as locations,
          if (count(w.id) = 0, json_array(), json_arrayagg(w.product_id)) as wishes
    from User u
    left join UserLocation ul on u.id = ul.user_id
    left join Wish w on w.user_id = u.id
    left join Location l on l.id = ul.id
    where u.github_email = ?;
    `,
  UPDATE_USER: `
    update User set name = ?
    where id = ?
    `,
  GET_USER_WITH_HASH_PASSWORD: `
    select u.id, u.user_id as userId, u.name as name, u.password as password
    from User u
    where u.user_id = ?;
    `,
  GET_USER_BY_GITHUB_ID: `
    select u.id, u.user_id as userId, u.name as name
    from User u
    where json_extract(u.github, '$.id') = ?;
    `,
};

const USER_LOCATION_QUERY = {
  INSERT_U_L: `
    insert into UserLocation (user_id, location_id, is_active)
    values (?, ?, ?);
    `,
  DELETE_U_L: `
    delete from UserLocation
    where user_id = ? and location_id = ?;
    `,
  UPDATE_U_L: `
    update UserLocation
    set is_active = true
    where user_id = ? and location_id = ?
    `,
  GET_COUNT_U_L: `
    select count(*) as count
    from UserLocation
    where user_id = ?
    `,
  UPDATE_ALL_U_L_TO_FALSE: `
    update UserLocation
    set is_active = false
    where user_id = ?
    `,
  UPDATE_ALL_U_L_TO_TRUE: `
    update UserLocation
    set is_active = true
    where user_id = ?
    `,
  GET_U_L_BY_UID_LID: `
    select user_id as userId, location_id as locationId
    from UserLocation
    where user_id = ? and location_id = ?;
    `,
};

const WISH_QUERY = {
  GET_WISH_BY_UID: `
    select p.id as id, title, imgUrl, price, l.dong as locationName, category_name as categoryName,
      seller_id as sellerId, p.createdAt as createdAt,
      (select if (count(w.id) = 0, json_array(), json_arrayagg(w.user_id))
      from Wish w
      where w.product_id = p.id) as likeUsers
    from Wish w
    left join Product p on w.product_id = p.id
    left join Location l on p.location_id = l.id
    where w.user_id = ?
    group by p.id;
    `,
  INSERT_WISH: `
    insert into Wish (user_id, product_id)
    values (?, ?)
    `,
  DELETE_WISH: `
    delete from Wish where user_id = ? and product_id = ?
    `,
  GET_WISH_BY_UID_PID: `
    select user_id as userId, product_id as productId
    from Wish
    where user_id = ? and product_id = ?
    `,
};

const CHAT_QUERY = {
  INSERT_CHATLOG: `
    insert into ChatLog (userId, chatRoomId, content) values (?, ?, ?);
  `,
  GET_CAHTLOG_BY_ID: `
    select * from ChatLog cl where cl.id = ?
  `,
  UPDATE_CHATLOG_WITH_IS_READ: `
    update ChatLog cl set cl.isRead = true where cl.id = ? and cl.userId = ?;
  `,
  INSERT_CHATROOM: `
    insert into ChatRoom (sellerId, buyerId, productId) values (?, ?, ?);
  `,
  GET_CHATROOMS_BY_PRODUCT_ID: `
    select 
      cr.id as id,
      cr.deletedAt as deletedAt,
      cr.deleteUserId as deleteUserId,
      (select json_object('id', u.id, 'name', u.name) from User u where u.id = cr.sellerId) as seller,
      (select json_object('id', u.id, 'name', u.name) from User u where u.id = cr.buyerId) as buyer,
      json_object('id', p.id, 'title', p.title,'imgUrl', p.imgUrl, 'price', p.price, 'status', p.status) as product,
      if (count(cl.id) = 0, json_array(), json_arrayagg(json_object('id', cl.id, 'userId', cl.userId, 'content', cl.content, 'isRead', cl.isRead, 'createdAt', cl.createdAt))) as chatLog
    from ChatRoom cr
    join Product p on p.id = cr.productId
    left join ChatLog cl on cr.id = cl.chatRoomId
    where (cr.productId = ? and cr.sellerId = ?) and (cr.deleteUserId != ? or cr.deleteUserId is null)
    group by cl.chatRoomId, cr.id;
  `,
  GET_CHATROOMS_BY_USER_ID: `
    select 
      cr.id as id,
      cr.deletedAt as deletedAt,
      cr.deleteUserId as deleteUserId,
      (select json_object('id', u.id, 'name', u.name) from User u where u.id = cr.sellerId) as seller,
      (select json_object('id', u.id, 'name', u.name) from User u where u.id = cr.buyerId) as buyer,
      json_object('id', p.id, 'title', p.title,'imgUrl', p.imgUrl, 'price', p.price, 'status', p.status) as product,
      if (count(cl.id) = 0, json_array(), json_arrayagg(json_object('id', cl.id, 'userId', cl.userId, 'content', cl.content, 'isRead', cl.isRead, 'createdAt', cl.createdAt))) as chatLog
    from ChatRoom cr
    join Product p on p.id = cr.productId
    left join ChatLog cl on cr.id = cl.chatRoomId
    where (cr.buyerId = ? or cr.sellerId = ?) and (cr.deleteUserId != ? or cr.deleteUserId is null)
    group by cl.chatRoomId, cr.id;
  `,
  GET_CHATROOM_BY_ID: `
    select 
      cr.id as id,
      cr.deletedAt as deletedAt,
      cr.deleteUserId as deleteUserId,
      (select json_object('id', u.id, 'name', u.name) from User u where u.id = cr.sellerId) as seller,
      (select json_object('id', u.id, 'name', u.name) from User u where u.id = cr.buyerId) as buyer,
      json_object('id', p.id, 'title', p.title,'imgUrl', p.imgUrl, 'price', p.price, 'status', p.status) as product,
      if (count(cl.id) = 0, json_array(), json_arrayagg(json_object('id', cl.id, 'userId', cl.userId, 'content', cl.content, 'isRead', cl.isRead, 'createdAt', cl.createdAt))) as chatLog
    from ChatRoom cr 
    join Product p on p.id = cr.productId
    left join (select * from ChatLog limit 999) as  cl on cr.id = cl.chatRoomId
    where cr.id = ?
    group by cl.chatRoomId, cr.id;
  `,
  CHECK_CHATROOM_BY_ID: `
    select ifnull(cr.id, null) from ChatRoom cr where cr.id = ?;
  `,
  SOFT_DELETE_CHATROOM_BY_ID: `
    update ChatRoom cr set deletedAt = now(), deleteUserId = ? where (cr.sellerId = ? or cr.buyerId) and cr.id = ?;
  `,
  DELETE_CHATROOM_BY_ID: `
    delete from ChatRoom cr where cr.id = ? and (cr.sellerId = ? or cr.buyerId);
  `,
};

export {
  AUTH_QUERY,
  CATEGORY_QUERY,
  LOCATION_QUERY,
  PRODUCT_QUERY,
  USER_QUERY,
  USER_LOCATION_QUERY,
  WISH_QUERY,
  CHAT_QUERY,
};
