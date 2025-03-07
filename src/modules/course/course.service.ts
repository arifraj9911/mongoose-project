import mongoose from "mongoose";
import QueryBuilder from "../../app/builder/QueryBuilder";
import { courseSearchableField } from "./course.constant";
import { TCourses, TCoursesFaculties } from "./course.interface";
import { CourseFaculty, Courses } from "./course.model";

const createCourseIntoDB = async (payload: TCourses) => {
  const result = await Courses.create(payload);
  return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Courses.find().populate("preRequisiteCourses.course"),
    query
  )
    .search(courseSearchableField)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = courseQuery.modelQuery;
  return result;
};

const getSingleCourseFromDB = async (id: string) => {
  const result = await Courses.findById(id).populate(
    "preRequisiteCourses.course"
  );

  return result;
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourses>) => {
  const { preRequisiteCourses, ...remainingCourseData } = payload;
  //   console.log(payload);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const basicCourseUpdate = await Courses.findByIdAndUpdate(
      id,
      { $set: remainingCourseData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!basicCourseUpdate) {
      throw new Error("Failed to update course");
    }

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      const deletedPreRequisites = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);

      // console.log(deletedPreRequisites);

      const deletedCoursePreRequisite = await Courses.findByIdAndUpdate(id, {
        $pull: {
          preRequisiteCourses: { course: { $in: deletedPreRequisites } },
        },
      });

      if (!deletedCoursePreRequisite) {
        throw new Error("Failed to delete preRequisite course");
      }

      const newPreRequisites = preRequisiteCourses
        .filter((el) => el.course && !el.isDeleted)
        .map((el) => ({ course: el.course, isDeleted: el.isDeleted }));

      // console.log(deletedPreRequisites);

      const newPreRequisiteCourse = await Courses.findByIdAndUpdate(id, {
        $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
      });

      if (!newPreRequisiteCourse) {
        throw new Error("Failed to add preRequisite course");
      }
    }

    await session.commitTransaction();

    const result = await Courses.findById(id).populate(
      "preRequisiteCourses.course"
    );

    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const deleteCourseFromDB = async (id: string) => {
  const result = await Courses.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  return result;
};

const assignFacultiesWithCourse = async (
  id: string,
  payload: Partial<TCoursesFaculties>
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload } },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  return result;
};

const removeFacultiesFromCourse = async (
  id: string,
  payload: Partial<TCoursesFaculties>
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload } },
    },
    {
      new: true,
    }
  );

  return result;
};

export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  updateCourseIntoDB,
  deleteCourseFromDB,
  assignFacultiesWithCourse,
  removeFacultiesFromCourse,
};
