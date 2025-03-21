import { Router } from "express";
import * as userController from "../controllers/userController";

const router = Router();

router.get("/users", userController.getUsers);
router.get("/users/:identifier", userController.getUser);
router.put("/users/:identifier", userController.updateUser);
router.delete("/users/:identifier", userController.deleteUser);

export default router;
