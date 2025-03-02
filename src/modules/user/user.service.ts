import config from "../../config";

import { AcademicSemester } from "../academicSemester/academicSemester.model";
import TStudent from "../student/student.interface";
import { Student } from "../student/student.model";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { generatedStudentId } from "./user.utils";

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  try {
    const userData: Partial<TUser> = {};

    // if password not given, use default password
    userData.password = password || (config.default_pass as string);

    // set role
    userData.role = "student";

    const admissionSemester = await AcademicSemester.findById(
      payload.admissionSemester
    );

    if (!admissionSemester) {
      throw new Error("Admission semester not found");
    }

    // set manually generated id
    userData.id = await generatedStudentId(admissionSemester);

    // mongoose built in instance method
    // create user
    const newUser = new User(userData);
    const result = await newUser.save();

    // console.log('new user',result)
    // console.log('new user student',Object.keys(result))

    // console.log('studentData:', studentData);

    //if got result, create student
    if (Object.keys(result).length) {
      // set id,_id as user
      payload.id = result.id;
      payload.user = result._id; //reference id

      const newStudent = await Student.create(payload);

      //   console.log('new student',newStudent)

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
