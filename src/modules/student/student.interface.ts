import { Model } from "mongoose";

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

interface TStudent {
  id: string;
  password: string;
  name: TName;
  email: string;
  avatar?: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  address?: string;
  department: string;
  rollNumber: string;
  registrationNumber: string;
  admissionYear: number;
  guardian?: TGuardian;
  guardianContact?: string;
  isDeleted: boolean;
}

export interface StudentModel extends Model<TStudent> {
  isUserExists(id: string): Promise<TStudent | null>;
}

export default TStudent;
