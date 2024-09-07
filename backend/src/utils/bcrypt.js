import bcrypt from "bcrypt";

const hashData = async (data) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(data, salt);
    return hashed;
  } catch (error) {
    throw error;
  }
};

const compareData = async (data, hashedData) => {
  try {
    const isValid = await bcrypt.compare(data, hashedData);
    return isValid;
  } catch (error) {
    throw error;
  }
};

export const Bcrypt = { hashData, compareData };
