import { Request, Response } from "express";
import { DriverService } from "../services/driver.service";

export class DriverController {
  private service = new DriverService();

  getAll = async (_req: Request, res: Response) => {
    const data = await this.service.getAll();
    return res.json(data);
  };

  getById = async (req: Request, res: Response) => {
    const entity = await this.service.getById(Number(req.params.id));
    if (!entity) return res.status(404).json({ message: "Not found" });
    return res.json(entity);
  };

  create = async (req: Request, res: Response) => {
    try {
      const entity = await this.service.create(req.body);
      return res.status(201).json(entity);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const result = await this.service.update(Number(req.params.id), req.body);
      if (result.affected === 0) return res.status(404).json({ message: "Not found" });
      const updated = await this.service.getById(Number(req.params.id));
      return res.json(updated);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const result = await this.service.delete(Number(req.params.id));
      if (result.affected === 0) return res.status(404).json({ message: "Not found" });
      return res.json({ message: "Deleted" });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}
