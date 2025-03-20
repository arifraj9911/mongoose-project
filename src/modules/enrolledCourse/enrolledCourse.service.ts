import mongoose from "mongoose";
import { OfferedCourse } from "../offeredCourse/offeredCourse.model";
import { Student } from "../student/student.model";
import { TEnrolledCourse } from "./enrolledCourse.interface";
import { EnrolledCourse } from "./enrolledCourse.model";
import SemesterRegistration from "../semesterRegistration/semesterRegistration.model";
import { Courses } from "../course/course.model";
import { Faculty } from "../faculty/faculty.model";
import { calculateGradeAndPoints } from "./enrolledCourse.utils";

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: TEnrolledCourse
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const isOfferedCourseExist = await OfferedCourse.findById(
      payload.offeredCourse
    );

    if (!isOfferedCourseExist) {
      throw new Error("Offered course does not exist!!");
    }

    if (isOfferedCourseExist.maxCapacity <= 0) {
      throw new Error("Room is Full!!");
    }

    const { offeredCourse } = payload;

    const isStudentExist = await Student.findOne({ id: userId }, { _id: 1 });

    if (!isStudentExist) {
      throw new Error("Student not found!!");
    }

    const isStudentAlreadyExistInEnrolledCourse = await EnrolledCourse.findOne({
      semesterRegistration: isOfferedCourseExist?.semesterRegistration,
      offeredCourse,
      student: isStudentExist._id,
    });

    if (isStudentAlreadyExistInEnrolledCourse) {
      throw new Error("Student already enrolled this offered course!!");
    }

    const course = await Courses.findById(isOfferedCourseExist.course);

    const currentCredit = course?.credits;

    const semesterRegistration = await SemesterRegistration.findById(
      isOfferedCourseExist.semesterRegistration
    ).select("maxCredit");

    const maxCredit = semesterRegistration?.maxCredit;

    const enrolledCourses = await EnrolledCourse.aggregate([
      {
        $match: {
          semesterRegistration: isOfferedCourseExist.semesterRegistration,
          student: isStudentExist._id,
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "enrolledCreditCount",
        },
      },
      {
        $unwind: "$enrolledCreditCount",
      },
      {
        $group: {
          _id: null,
          totalEnrollCredit: { $sum: "$enrolledCreditCount.credits" },
        },
      },
      {
        $project: { _id: 0, totalEnrollCredit: 1 },
      },
    ]);

    const totalCredit =
      enrolledCourses.length > 0 ? enrolledCourses[0].totalEnrollCredit : 0;

    if (totalCredit && maxCredit && totalCredit + currentCredit > maxCredit) {
      throw new Error("You are exceed maximum credit of this semester!!");
    }

    const result = await EnrolledCourse.create(
      [
        {
          semesterRegistration: isOfferedCourseExist.semesterRegistration,
          academicSemester: isOfferedCourseExist.academicSemester,
          academicDepartment: isOfferedCourseExist.academicDepartment,
          academicFaculty: isOfferedCourseExist.academicFaculty,
          offeredCourse,
          course: isOfferedCourseExist.course,
          faculty: isOfferedCourseExist.faculty,
          student: isStudentExist._id,
          isEnrolled: true,
        },
      ],
      { session }
    );

    if (!result) {
      throw new Error("Failed to enrolled student in offered course!!");
    }

    const maxCapacity = isOfferedCourseExist.maxCapacity;

    await OfferedCourse.findByIdAndUpdate(
      offeredCourse,
      {
        maxCapacity: maxCapacity - 1,
      },
      { session }
    );

    await session.commitTransaction();

    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const updateEnrolledCourseIntoDB = async (
  userId: string,
  payload: Partial<TEnrolledCourse>
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;

  const isSemesterRegistration = await SemesterRegistration.findById(
    semesterRegistration
  );

  if (!isSemesterRegistration) {
    throw new Error("Semester registration does not exist!!");
  }

  const isOfferedCourseExist = await OfferedCourse.findById(offeredCourse);

  if (!isOfferedCourseExist) {
    throw new Error("Offered course does not exist!!");
  }

  const isStudentExist = await Student.findById(student);

  if (!isStudentExist) {
    throw new Error("Student does not found!!");
  }

  const isFaculty = await Faculty.findOne({ id: userId }, { _id: 1 });

  if (!isFaculty) {
    throw new Error("Faculty does not found!!");
  }

  const isCourseBelongsToFaculty = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: isFaculty,
  });

  if (!isCourseBelongsToFaculty) {
    throw new Error(
      "Course  does not belong to this faculty. Forbidden Access!!!"
    );
  }

  const modifiedData: Record<string, unknown> = {
    ...courseMarks,
  };

  if (courseMarks?.finalTerm) {
    const { classTest1, classTest2, midTerm, finalTerm } =
      isCourseBelongsToFaculty.courseMarks;

    const totalMarks = classTest1 + classTest2 + midTerm + finalTerm;

    const result = calculateGradeAndPoints(totalMarks);

    // console.log(totalMarks);
    // console.log(modifiedData);

    modifiedData.grade = result.grade;
    modifiedData.gradePoints = result.gradePoints;
    modifiedData.isCompleted = true;

    // console.log(modifiedData);
  }

  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
    }
  }

  const result = await EnrolledCourse.findByIdAndUpdate(
    isCourseBelongsToFaculty?._id,
    modifiedData,
    { new: true }
  );

  console.log(result);

  return result;
};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
  updateEnrolledCourseIntoDB,
};
