import express, { Request, Response } from "express";
import { userContollers } from "./user.controller";
import logger from "../../middleware/logger";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", userContollers?.createUsers);

router.get("/", logger, auth("admin"), userContollers?.getUsers)

router.get("/:id", userContollers?.getSingleUser)

router.put("/:id", userContollers.updateUser)

router.delete("/:id", userContollers.deleteUser)

export const userRoute = router;