import express, { Application, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./modules/middleware/globalErrorHandler";
import notFoundRoute from "./modules/middleware/notFoundRoute";
import router from "./routes";
const app: Application = express();

// parser
app.use(express.json());
app.use(cors());

const userRouter = express.Router();
app.use("/api/v1/users", userRouter);

// application route
app.use("/api/v2", router);

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

// global error handler middleware
app.use(globalErrorHandler);

// not found route
app.use(notFoundRoute)

export default app;
