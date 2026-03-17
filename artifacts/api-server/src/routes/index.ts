import { Router, type IRouter } from "express";
import healthRouter from "./health";
import galleryRouter from "./gallery";
import contactRouter from "./contact";
import submitRouter from "./submit";

const router: IRouter = Router();

router.use(healthRouter);
router.use(galleryRouter);
router.use(contactRouter);
router.use(submitRouter);

export default router;
