export const isNameValid = (firstName: string, lastName: string): boolean => {
  const nameRegex = /^(?=.{1,20}$)\p{L}+(?:[- ]\p{L}+)*$/u;
  return nameRegex.test(firstName) && nameRegex.test(lastName);
};

export const isUsernameValid = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_-]{8,20}$/;
  return usernameRegex.test(username);
};

export const isPasswordValid = (password: string): boolean => {
  return password.length >= 8 && password.trim().length === password.length;
};

export const isEmailValid = (email: string): boolean => {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  const username = email.split("@")[0];
  return emailRegex.test(email) && username.charAt(username.length - 1) !== ".";
};
