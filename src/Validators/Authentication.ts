export const isNameValid = (firstName: string, lastName: string): boolean => {
  const normalize = (s: string) =>
    s
      .normalize("NFC") // compose accents: e + ́  → é
      .replace(/\s+/g, " ") // collapse NBSP/tabs/doubles into one space
      .trim(); // strip leading/trailing whitespace

  const nameRegex = /^(?=.{1,20}$)\p{L}+(?:[- ]\p{L}+)*$/u;
  return (
    nameRegex.test(normalize(firstName)) && nameRegex.test(normalize(lastName))
  );
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
  if (username)
    return (
      emailRegex.test(email) && username.charAt(username.length - 1) !== "."
    );
  return false;
};
