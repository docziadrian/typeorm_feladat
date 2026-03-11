import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { RaceResult } from "../entities/entities/RaceResult";

export class RaceResultService {
  constructor(private repo: Repository<RaceResult> = AppDataSource.getRepository(RaceResult)) {}

  async getAll() {
    return this.repo.find({ relations: ["race", "driver", "team"] });
  }

  async getById(id: number) {
    return this.repo.findOne({ where: { id }, relations: ["race", "driver", "team"] });
  }

  async create(data: Partial<RaceResult>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<RaceResult>) {
    return this.repo.update(id, data);
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }

  async count() {
    return this.repo.count();
  }
}
