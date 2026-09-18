const sanitizeUser = (user) => {
  if (!user) {
    return user;
  }

  const { password: _password, ...publicUser } = user;

  return publicUser;
};

const sanitizeUsers = (users) => users.map(sanitizeUser);

module.exports = {
  sanitizeUser,
  sanitizeUsers,
};
