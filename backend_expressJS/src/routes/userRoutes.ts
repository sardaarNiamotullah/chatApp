import { Router } from "express";
import * as userController from "../controllers/userController";


const router = Router();

router.get("/me", userController.getLoggedInUser); // get own profile
router.put("/me", userController.updateLoggedInUser); // update own profile

router.get("/all", userController.getUsers);
router.get("/search/:identifier", userController.getUser);
router.put("/search/:identifier", userController.updateUser);
router.delete("/search/:identifier", userController.deleteUser);

router.get('/not-sent-requests-to-me', userController.getUsersNotSentRequestsToMe);

export default router;
