import express, { Application, Request, Response } from "express";
import cors from "cors";
import { StudentRoutes } from "./modules/student/student.route";
import { UserRoutes } from "./modules/user/user.route";
const app: Application = express();

// parser
app.use(express.json());
app.use(cors());

const userRouter = express.Router();
app.use("/api/v1/users", userRouter);

// application route
app.use("/api/v2/students", StudentRoutes);
app.use("/api/v2/users", UserRoutes);

userRouter.get("/my-profile", (req: Request, res: Response) => {
  console.log("profile is seen");
  res.status(200).json({
    success: true,
    message: "profile is seen now in website",
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

export default app;
