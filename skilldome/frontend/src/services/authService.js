export const getUserByEmail = (email) => {
  if (!email) return null;
  const data = localStorage.getItem(`skilldome_user_${email}`);
  return data ? JSON.parse(data) : null;
};

export const saveUser = (email, userInfo) => {
  if (!email) return false;
  localStorage.setItem(`skilldome_user_${email}`, JSON.stringify(userInfo));
  return true;
};
