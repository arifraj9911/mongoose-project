/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import QueryBuilder from "../../app/builder/QueryBuilder";
import { Admin } from "./admin.model";
import { adminSearchField } from "./admin.contant";
import TAdmin from "./admin.interface";
import { User } from "../user/user.model";

const getAllAdminFromDB = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(
    Admin.find().populate("managementDepartment"),
    query
  )
    .search(adminSearchField)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await adminQuery.modelQuery;

  return result;
};

const getSingleAdminFromDB = async (id: string) => {
  const result = await Admin.findOne({ id });

  return result;
};

const updateAdminIntoDB = async (id: string, payload: Partial<TAdmin>) => {
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

    const result = await Admin.findOneAndUpdate(
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

const deleteAdminFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // const result = await StudentModel.findOne({ _id: id });
    const deleteAdmin = await Admin.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session }
    );
    if (!deleteAdmin) {
      throw new Error("Failed to delete Admin");
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

    return { message: "Admin and User Deleted Successfully", deleteAdmin };
  } catch (error: any) {
    console.error("Transaction failed:", error);
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const AdminServices = {
  getAllAdminFromDB,
  getSingleAdminFromDB,
  updateAdminIntoDB,
  deleteAdminFromDB,
};
