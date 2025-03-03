import { Model, Types } from "mongoose";

interface TName {
  firstName: string;
  middleName?: string;
  lastName: string;
}
interface TGuardian {
  guardianName: string;
  contact: string;
  email?: string;
  address?: string;
}
interface TLocalGuardian {
  guardianName: string;
  contact: string;
  email?: string;
  address?: string;
}

interface TStudent {
  id: string;
  user: Types.ObjectId;
  name: TName;
  email: string;
  gender: "Male" | "Female" | "Other";
  dateOfBirth: Date;
  contactNo: string;
  emergencyContact: string;
  presentAddress: string;
  permanentAddress: string;
  profileImage: string;
  admissionYear: number;
  guardian: TGuardian;
  localGuardian: TLocalGuardian;
  guardianContact: string;
  admissionSemester: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  isDeleted: boolean;
}

export interface StudentModel extends Model<TStudent> {
  isUserExists(id: string): Promise<TStudent | null>;
}

export default TStudent;
