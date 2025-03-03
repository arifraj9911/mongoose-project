import { model, Schema } from "mongoose";
import { TAcademicDepartment } from "./academicDepartment.interface";

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: { type: String, required: true, unique: true },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "AcademicFaculty",
    },
  },
  {
    timestamps: true,
  }
);

// way - 02(to handle existing element [pre hook middleware])

academicDepartmentSchema.pre("save", async function (next) {
  const isExistDepartment = await AcademicDepartment.findOne({
    name: this.name,
  });

  if (isExistDepartment) {
    throw new Error("Department already exists");
  }

  next();
});

// query middleware hook for update
academicDepartmentSchema.pre("findOneAndUpdate", async function (next) {
  const query = this.getQuery();
  console.log("Query Middleware Hit:", query);
  next(); // Ensure next() is called
});

export const AcademicDepartment = model<TAcademicDepartment>(
  "AcademicDepartment",
  academicDepartmentSchema
);
