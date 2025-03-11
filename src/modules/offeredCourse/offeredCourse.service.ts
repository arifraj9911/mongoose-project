import mongoose from "mongoose";
import QueryBuilder from "../../app/builder/QueryBuilder";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import { Courses } from "../course/course.model";
import { Faculty } from "../faculty/faculty.model";
import SemesterRegistration from "../semesterRegistration/semesterRegistration.model";
import { TOfferedCourse } from "./offeredCourse.interface";
import { OfferedCourse } from "./offeredCourse.model";
import { hasTimeConflict } from "./offeredCourse.utils";
import { SemesterRegistrationStatus } from "../semesterRegistration/semesterRegistration.constant";

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicDepartment,
    academicFaculty,
    course,
    section,
    faculty,
    days,
    startTime,
    endTime,
  } = payload;

  // check semester id is exist
  const isSemesterRegistration = await SemesterRegistration.findById(
    semesterRegistration
  );

  if (!isSemesterRegistration) {
    throw new Error("Semester Registration does not exists");
  }

  const academicSemester = isSemesterRegistration.academicSemester;

  const isAcademicDepartment = await AcademicDepartment.findById(
    academicDepartment
  );

  if (!isAcademicDepartment) {
    throw new Error("Academic Department does not exists");
  }

  const isAcademicFaculty = await AcademicFaculty.findById(academicFaculty);

  if (!isAcademicFaculty) {
    throw new Error("Academic Faculty does not exists");
  }

  const isCourse = await Courses.findById(course);

  if (!isCourse) {
    throw new Error("Course does not exists");
  }

  const isFaculty = await Faculty.findById(faculty);

  if (!isFaculty) {
    throw new Error("Faculty does not exists");
  }

  const isSameCourseWithSameSectionInSameSemester = await OfferedCourse.findOne(
    {
      semesterRegistration,
      course,
      section,
    }
  );

  if (isSameCourseWithSameSectionInSameSemester) {
    throw new Error("Offered course with same section is already exists!");
  }

  const isAcademicDepartmentBelongOnFaculty = await AcademicDepartment.findOne({
    _id: new mongoose.Types.ObjectId(academicDepartment),
    academicFaculty,
  });

  if (!isAcademicDepartmentBelongOnFaculty) {
    throw new Error(
      `This ${isAcademicDepartment.name} is not belong to this ${isAcademicFaculty.name}`
    );
  }

  const assignScheduled = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days }, // days onujayi oi diner data dibe
  });

  const newScheduled = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignScheduled, newScheduled)) {
    throw new Error(
      "Conflict detected: The new schedule overlaps with an existing one."
    );
  }

  const result = await OfferedCourse.create({ ...payload, academicSemester });

  return result;
};

const getAllOfferedCourseIntoDB = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(OfferedCourse.find(), query)
    .search(["days"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await offeredCourseQuery.modelQuery;

  return result;
};

const getSingleOfferedCourseIntoDB = async (id: string) => {
  const result = await OfferedCourse.findById(id);

  return result;
};

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, "days" | "startTime" | "endTime" | "faculty">
) => {
  const { faculty, days, startTime, endTime } = payload;

  const isOfferedCourseExists = await OfferedCourse.findById(id);

  if (!isOfferedCourseExists) {
    throw new Error("Offered course does not exists");
  }

  const isFacultyExists = await Faculty.findById(faculty);

  // console.log(payload, faculty);
  // console.log(isFacultyExists);

  if (!isFacultyExists) {
    throw new Error("Faculty in offered course does not exists");
  }

  const semesterRegistration = isOfferedCourseExists.semesterRegistration;

  const semesterRegistrationStatus = await SemesterRegistration.findById(
    semesterRegistration
  );

  if (
    semesterRegistrationStatus?.status !== SemesterRegistrationStatus.UPCOMING
  ) {
    throw new Error(
      `Conflict detected: You can not update offered course as it is ${semesterRegistrationStatus?.status}`
    );
  }

  const assignScheduled = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days }, // days onujayi oi diner data dibe
  });

  const newScheduled = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignScheduled, newScheduled)) {
    throw new Error(
      "Conflict detected: The new schedule overlaps with an existing one."
    );
  }

  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteOfferedCourseFromDB = async (id: string) => {
  const isOfferedCourseExists = await OfferedCourse.findById(id);

  if (!isOfferedCourseExists) {
    throw new Error("Offered course does not exists");
  }

  const semesterRegistration = isOfferedCourseExists.semesterRegistration;

  const semesterRegistrationStatus = await SemesterRegistration.findById(
    semesterRegistration
  ).select("status");

  if (
    semesterRegistrationStatus?.status !== SemesterRegistrationStatus.UPCOMING
  ) {
    throw new Error(
      `Conflict detected: You can not delete offered course as it is ${semesterRegistrationStatus?.status}`
    );
  }

  const result = await OfferedCourse.findByIdAndDelete(id);

  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCourseIntoDB,
  getSingleOfferedCourseIntoDB,
  updateOfferedCourseIntoDB,
  deleteOfferedCourseFromDB,
};
