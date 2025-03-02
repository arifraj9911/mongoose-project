export type TMonth =
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December";

export type TAcademicSemesterName = "Summer" | "Autumn" | "Fall";
export type TAcademicSemesterCode = "01" | "02" | "03";

export type TAcademicSemesterSchema = {
  name: TAcademicSemesterName;
  code: TAcademicSemesterCode;
  year: string;
  startMonth: TMonth;
  endMonth: TMonth;
};

export type TAcademicSemesterNameCode = {
  [key: string]: string;
};
