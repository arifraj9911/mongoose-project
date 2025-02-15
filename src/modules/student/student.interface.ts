interface Name {
  firstName: string;
  middleName?: string;
  lastName: string;
}
interface Guardian {
  guardianName: string;
  contact: string;
  email?: string;
  address?: string;
}

interface Student {
  id: string;
  name: Name;
  email: string;
  avatar?: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone?: string;
  address?: string;
  department: string;
  rollNumber: string;
  registrationNumber: string;
  admissionYear: number;
  guardian?: Guardian;
  guardianContact?: string;
}

export default Student;
