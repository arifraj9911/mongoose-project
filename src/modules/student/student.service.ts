/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { Student } from "./student.model";
import { User } from "../user/user.model";
import TStudent from "./student.interface";
import QueryBuilder from "../../app/builder/QueryBuilder";
import { studentSearchField } from "./student.constant";

const getAllStudentFromDB = async (query: Record<string, unknown>) => {
  try {
    // let searchTerm = "";
    // const queryObj = { ...query };

    // if (query?.searchTerm) {
    //   searchTerm = query.searchTerm as string;
    // }

    // console.log('base query',query);

    // const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];

    // excludeFields.forEach((el) => delete queryObj[el]);

    // console.log("base query", query);
    // console.log("modified query", queryObj);

    // const searchQuery = Student.find({
    //   $or: studentSearchField.map((field) => ({
    //     [field]: { $regex: searchTerm, $options: "i" },
    //   })),
    // });

    // const filterQuery = searchQuery
    //   .find(queryObj)
    // .populate("user")
    // .populate("admissionSemester")
    // .populate({
    //   path: "academicDepartment",
    //   populate: {
    //     path: "academicFaculty",
    //   },
    // });

    // let sort = "-createdAt";

    // if (query?.sort) {
    //   sort = query.sort as string;
    // }

    // const sortQuery = filterQuery.sort(sort);

    // let page = 1;
    // let limit = 1;
    // let skip = 0;

    // if (query?.limit) {
    //   limit = Number(query.limit);
    // }
    // if (query?.page) {
    //   page = Number(query.page);
    //   skip = (page - 1) * limit;
    // }

    // const paginateQuery = sortQuery.skip(skip);

    // const limitQuery = paginateQuery.limit(limit);

    // let fields = "__v";

    // if (query?.fields) {
    //   fields = (query.fields as string).split(",").join(" ");
    //   console.log({ fields });
    // }

    // const fieldQuery = await limitQuery.select(fields);

    // return fieldQuery;

    const studentQuery = new QueryBuilder(
      Student.find()
        
        .populate("user")
        .populate("admissionSemester")
        .populate({
          path: "academicDepartment",
          populate: {
            path: "academicFaculty",
          },
        }),
      query
    )
      .search(studentSearchField)
      .filter()
      .sort()
      .paginate()
      .fields();

    const result = await studentQuery.modelQuery;
    return result;
  } catch (error: any) {
    console.log(error);
    throw error;
    // throw new Error(error._message || error.message || "Failed to get student");
  }
};
const getSingleStudentFromDB = async (id: string) => {
  try {
    // const result = await StudentModel.findOne({ _id: id });
    //const result = await Student.findById(id); // same ^|

    const objectId = new mongoose.Types.ObjectId(id);
    // using aggregate pipeline
    const result = await Student.findOne({ _id: objectId })
      .populate("user")
      .populate("admissionSemester")
      .populate({
        path: "academicDepartment",
        populate: {
          path: "academicFaculty",
        },
      });

    if (!result) {
      throw new Error("Student not found");
    }

    // console.log(result);
    return result;
  } catch (error: any) {
    console.log(error);
    throw error;
    // throw new Error(error._message || error.message || "Failed to get student");
  }
};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  try {
    const updatePayload: any = {};

    // Function to process nested fields dynamically(ensure update non-primitive data without replace them)
    const processNestedFields = (object: any, parentKey: string = "") => {
      Object.keys(object).forEach((key) => {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;

        if (typeof object[key] === "object" && object[key] !== null) {
          // Recursively process nested objects
          processNestedFields(object[key], fullKey);
        } else {
          // For non-object fields, add them to the updatePayload
          updatePayload[fullKey] = object[key];
        }
      });
    };

    // Check if 'students' exists in payload and process it
    processNestedFields(payload);

    const result = await Student.findOneAndUpdate(
      { id },
      { $set: updatePayload },
      { new: true }
    );

    if (!result) {
      throw new Error("Student not found");
    }

    // console.log(result);
    return result;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // const result = await StudentModel.findOne({ _id: id });
    const deleteStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session }
    );
    if (!deleteStudent) {
      throw new Error("Failed to delete Student");
    }

    const deleteUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session }
    );

    if (!deleteUser) {
      throw new Error("Failed to delete User");
    }

    await session.commitTransaction();
    await session.endSession();

    return { message: "Student and User Deleted Successfully", deleteStudent };
  } catch (error: any) {
    console.error("Transaction failed:", error);
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message || "Transaction failed");
  }
};

export const StudentService = {
  getAllStudentFromDB,
  getSingleStudentFromDB,
  updateStudentIntoDB,
  deleteStudentFromDB,
};
