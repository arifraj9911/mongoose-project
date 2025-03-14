/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import QueryBuilder from "../../app/builder/QueryBuilder";
import { facultySearchField } from "./faculty.constant";
import TFaculty from "./faculty.interface";
import { Faculty } from "./faculty.model";
import { User } from "../user/user.model";

const getAllFacultyFromDB = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(
    Faculty.find().populate("academicDepartment").populate("academicFaculty"),
    query
  )
    .search(facultySearchField)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await facultyQuery.modelQuery;

  return result;
};

const getSingleFacultyFromDB = async (id: string) => {
  const result = await Faculty.findOne({ id });

  return result;
};

const updateFacultyIntoDB = async (id: string, payload: Partial<TFaculty>) => {
  if (!Object.keys(payload).length) {
    throw new Error("Payload is empty, nothing to update.");
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const updatePayload: any = {};

    // Function to process nested fields dynamically(ensure update non-primitive data without replace them)
    const processNestedFields = (object: any, parentKey: string = "") => {
      Object.keys(object).forEach((key) => {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;

        if (
          typeof object[key] === "object" &&
          object[key] !== null &&
          !Array.isArray(object[key])
        ) {
          // Recursively process nested objects
          processNestedFields(object[key], fullKey);
        } else {
          // For non-object fields, add them to the updatePayload
          updatePayload[fullKey] = object[key];
        }
      });
    };

    // Check if 'faculty' exists in payload and process it
    processNestedFields(payload);

    const result = await Faculty.findOneAndUpdate(
      { id },
      { $set: updatePayload },
      { new: true, session }
    );

    await session.commitTransaction();

    return result;
  } catch (error: any) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const deleteFacultyFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // const result = await StudentModel.findOne({ _id: id });
    const deleteFaculty = await Faculty.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session }
    );
    if (!deleteFaculty) {
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

    return { message: "Faculty and User Deleted Successfully", deleteFaculty };
  } catch (error: any) {
    console.error("Transaction failed:", error);
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const FacultyServices = {
  getAllFacultyFromDB,
  getSingleFacultyFromDB,
  updateFacultyIntoDB,
  deleteFacultyFromDB,
};
