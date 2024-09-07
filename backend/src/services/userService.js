import { Bcrypt } from "~/utils/bcrypt";
import { userModel } from "~/models/userModel";
const createNew = async (reqBody) => {
  try {
    const newUser = {
      ...reqBody,
      password: await Bcrypt.hashData(reqBody.password),
    };

    const createdUser = await userModel.createNewUser(newUser);
    const result = await userModel.findOneById(createdUser.insertedId);

    return result;
  } catch (error) {
    throw error;
  }
};

const getOneUserById = async (id) => {
  try {
    return await userModel.findOneById(id);
  } catch (error) {
    throw error;
  }
};

const updateUserById = async (id, data) => {
  try {
    const updatedUser = await userModel.updateUserById(id, data);
    if (updatedUser) {
      const { password, ...result } = updatedUser;
      return result;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

const deleteUserById = async (id) => {
  try {
    return await userModel.deleteUserById(id);
  } catch (error) {
    throw error;
  }
};

export const userService = {
  createNew,
  getOneUserById,
  updateUserById,
  deleteUserById,
};
