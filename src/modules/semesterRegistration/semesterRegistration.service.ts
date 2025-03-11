import mongoose from "mongoose";
import QueryBuilder from "../../app/builder/QueryBuilder";
import { AcademicSemester } from "../academicSemester/academicSemester.model";
import { OfferedCourse } from "../offeredCourse/offeredCourse.model";
import {
  SemesterRegistrationStatus,
  semesterSearchField,
} from "./semesterRegistration.constant";
import { TSemesterRegsitration } from "./semesterRegistration.interface";
import SemesterRegistration from "./semesterRegistration.model";

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegsitration
) => {
  // check academic faculty exist kore kina
  const academicSemester = payload?.academicSemester;
  const isExistAcademicSemester = await AcademicSemester.findById(
    academicSemester
  );

  if (!isExistAcademicSemester) {
    throw new Error("Academic Semester not found!");
  }

  // check if there any upcoming or ongoing semester exists
  const isThereUpcomingOrOngoingSemester = await SemesterRegistration.findOne({
    $or: [
      { status: SemesterRegistrationStatus.UPCOMING },
      { status: SemesterRegistrationStatus.ONGOING },
    ],
  });

  if (isThereUpcomingOrOngoingSemester) {
    throw new Error(
      `There already exist ${isThereUpcomingOrOngoingSemester?.status} semester`
    );
  }

  //   check semester exist
  const isSemesterExist = await SemesterRegistration.findOne({
    academicSemester,
  });

  if (isSemesterExist) {
    throw new Error("Semester already exist!");
  }

  const result = await SemesterRegistration.create(payload);

  return result;
};

const getAllSemesterRegistrationFromDB = async (
  query: Record<string, unknown>
) => {
  const semesterQuery = new QueryBuilder(
    SemesterRegistration.find().populate("academicSemester"),
    query
  )
    .search(semesterSearchField)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await semesterQuery.modelQuery;

  return result;
};

const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id).populate(
    "academicSemester"
  );

  return result;
};

const updateSemesterRegistrationFromDB = async (
  id: string,
  payload: Partial<TSemesterRegsitration>
) => {
  // check if semester registration exist or not
  const semesterRegistration = await SemesterRegistration.findById(id);

  if (!semesterRegistration) {
    throw new Error(" Semester Registration not found!");
  }

  // check semester ENDED
  const currentSemester = semesterRegistration?.status;
  const requestedStatus = payload?.status;

  if (currentSemester === SemesterRegistrationStatus.ENDED) {
    throw new Error("Semester already ENDED!");
  }

  // UPCOMING ==> ONGOING ==> ENDED

  if (
    currentSemester === SemesterRegistrationStatus.UPCOMING &&
    requestedStatus === SemesterRegistrationStatus.ENDED
  ) {
    throw new Error(
      `You can not change directly from ${currentSemester} to ${requestedStatus}`
    );
  }

  if (
    currentSemester === SemesterRegistrationStatus.ONGOING &&
    requestedStatus === SemesterRegistrationStatus.UPCOMING
  ) {
    throw new Error(
      `You can not change directly from ${currentSemester} to ${requestedStatus}`
    );
  }

  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteSemesterRegistrationWithAssociateOfferedCourse = async (
  id: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const isSemesterExist = await SemesterRegistration.findById(id);

    if (!isSemesterExist) {
      throw new Error(" Semester Registration not found!");
    }

    if (isSemesterExist?.status !== SemesterRegistrationStatus.UPCOMING) {
      throw new Error(
        `Yoy can not delete this semester registration as it is ${isSemesterExist?.status}`
      );
    }

    await OfferedCourse.deleteMany(
      {
        semesterRegistration: id,
      },
      { session }
    );

    const result = await SemesterRegistration.findByIdAndDelete(id, {
      session,
    });

    // console.log(offeredCourseWithThisSemesterRagistrationId);

    await session.commitTransaction();

    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationFromDB,
  deleteSemesterRegistrationWithAssociateOfferedCourse,
};
