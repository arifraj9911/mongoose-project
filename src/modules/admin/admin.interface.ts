import { Model, Types } from "mongoose";

interface TAdminName {
  firstName: string;
  middleName?: string;
  lastName: string;
}
interface TAdminGuardian {
  guardianName: string;
  contact: string;
  email?: string;
  address?: string;
}
interface TAdminLocalGuardian {
  guardianName: string;
  contact: string;
  email?: string;
  address?: string;
}

interface TAdmin {
  id: string;
  user: Types.ObjectId;
  name: TAdminName;
  designation:string,
  email: string;
  gender: "Male" | "Female" | "Other";
  dateOfBirth: Date;
  contactNo: string;
  emergencyContact: string;
  presentAddress: string;
  permanentAddress: string;
  profileImage: string;
  guardian: TAdminGuardian;
  localGuardian: TAdminLocalGuardian;
  guardianContact: string;
  managementDepartment: Types.ObjectId;
  isDeleted: boolean;
}

export interface AdminModel extends Model<TAdmin> {
  isUserExists(id: string): Promise<TAdmin | null>;
}

export default TAdmin;
