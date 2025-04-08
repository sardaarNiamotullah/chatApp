import { Router } from "express";
import * as connectionController from "../controllers/connectionController";

const router = Router();

router.get("/all", connectionController.getConnections)
router.post("/send", connectionController.sendRequest);
router.delete("/cancel", connectionController.cancelRequest);
router.post("/accept", connectionController.acceptRequest);
router.post("/delete", connectionController.deleteConnection);
router.get("/areconnected", connectionController.areConnected);
router.get("/requests", connectionController.getConnectionRequests);


export default router;
