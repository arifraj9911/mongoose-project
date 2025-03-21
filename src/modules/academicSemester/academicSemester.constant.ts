import {
  TAcademicSemesterCode,
  TAcademicSemesterName,
  TAcademicSemesterNameCode,
  TMonth,
} from "./academicSemester.interface";

export const Months: TMonth[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const AcademicSemesterName: TAcademicSemesterName[] = [
  "Autumn",
  "Summer",
  "Fall",
];
export const AcademicSemesterCode: TAcademicSemesterCode[] = ["01", "02", "03"];

export const AcademicSemesterNameCodeMapper: TAcademicSemesterNameCode = {
  Summer: "01",
  Autumn: "02",
  Fall: "03",
};
