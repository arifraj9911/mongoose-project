import { Model, Types } from "mongoose";

interface TFacultyName {
  firstName: string;
  middleName?: string;
  lastName: string;
}
interface TFacultyGuardian {
  guardianName: string;
  contact: string;
  email?: string;
  address?: string;
}
interface TFacultyLocalGuardian {
  guardianName: string;
  contact: string;
  email?: string;
  address?: string;
}

interface TFaculty {
  id: string;
  user: Types.ObjectId;
  name: TFacultyName;
  email: string;
  gender: "Male" | "Female" | "Other";
  dateOfBirth: Date;
  contactNo: string;
  emergencyContact: string;
  presentAddress: string;
  permanentAddress: string;
  profileImage: string;
  guardian: TFacultyGuardian;
  localGuardian: TFacultyLocalGuardian;
  guardianContact: string;
  academicDepartment: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  isDeleted: boolean;
}

export interface FacultyModel extends Model<TFaculty> {
  isUserExists(id: string): Promise<TFaculty | null>;
}

export default TFaculty;
