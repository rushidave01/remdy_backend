// src/utils/utils.ts

import bcrypt from 'bcrypt';

export const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const bcryptHash = async (password:string) => {
  return bcrypt.hash(password, 12);
}

export const getPagination = (
  page: number = 1,
  size: number = 25
) => {
  const limit = size ? size : 10;
  const offset = page - 1 <= 0 ? 0 : (page - 1) * limit; // page is 1 based instead of 0 based
  return { limit, offset };
};

export const isValidPassword = async (password: string, hashedPassword: string): Promise<boolean> =>{
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
     // Return whether the passwords match or not
     return isMatch;
  } catch (error) {
    console.error("Error comparing password:", error);
    return false; // Return false if an error occurs
  }
}
  