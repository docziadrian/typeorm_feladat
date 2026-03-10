import { Router, Request, Response, NextFunction } from "express";
import { TeamController } from "../controllers/team.controller";
import { body, param, validationResult } from "express-validator";

const router = Router();
const controller = new TeamController();

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  "/",
  [body("name").isString().notEmpty().isLength({ max: 100 }), validate],
  controller.create,
);
router.get("/", controller.list);
router.get("/:id", [param("id").isNumeric(), validate], controller.getById);
router.patch(
  "/:id",
  [
    // id, name, base, principal, powerUnit, color -> ezeket kell body-val validálni
    param("id").isNumeric(),
    body("name").isString().notEmpty().isLength({ max: 100 }),
    body("base").isString().notEmpty().isLength({ max: 100 }),
    body("principal").isString().notEmpty().isLength({ max: 100 }),
    body("powerUnit").isString().notEmpty().isLength({ max: 100 }),
    body("color").isString().notEmpty().isLength({ max: 100 }),
    validate,
  ],
  controller.update,
);
router.delete("/:id", [param("id").isNumeric(), validate], controller.delete);
router.get(
  "/:id/tasks",
  [param("id").isNumeric(), validate],
  controller.getWithTasks,
);

export default router;
