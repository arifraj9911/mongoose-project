import config from "../../config";
import TStudent from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";

const createStudentIntoDB = async (password: string, studentData: TStudent) => {
  try {
    const userData: Partial<TUser> = {};

    // if password not given, use default password
    userData.password = password || (config.default_pass as string);

    // set role
    userData.role = "student";

    // set manually generated id
    userData.id = "18EEE161";

    // mongoose built in instance method
    // create user
    const newUser = new User(userData);
    const result = await newUser.save();

    //if got result, create student
    if (Object.keys(result).length) {
      // set id,_id as user
      studentData.id = result.id;
      studentData.user = result._id; //reference id

      const newStudent = await Student.create(studentData);

      return newStudent;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const UserServices = {
  createStudentIntoDB,
};
