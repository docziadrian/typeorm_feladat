import { Router, Request, Response, NextFunction } from "express";
import { TaskController } from "../controllers/task.controller";
import { body, param, validationResult } from "express-validator";

const router = Router();
const controller = new TaskController();

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  "/",
  [
    body("title").isString().notEmpty().isLength({ max: 200 }),
    body("description").isString().notEmpty().isLength({ max: 500 }),
    body("userId").isUUID(),
    validate,
  ],
  controller.create,
);
router.get("/", controller.list);
router.get("/:id", [param("id").isUUID(), validate], controller.getById);
router.get(
  "/user/:userId",
  [param("userId").isUUID(), validate],
  controller.listByUser,
);
router.patch(
  "/:id",
  [
    param("id").isUUID(),
    body("title").isString().notEmpty().isLength({ max: 200 }),
    body("description").isString().notEmpty().isLength({ max: 500 }),
    body("completed").optional().isBoolean(),
    validate,
  ],
  controller.update,
);
router.delete("/:id", [param("id").isUUID(), validate], controller.delete);

export default router;
