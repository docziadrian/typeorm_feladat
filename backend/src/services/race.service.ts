import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Race } from "../entities/entities/Race";

export class RaceService {
  constructor(private repo: Repository<Race> = AppDataSource.getRepository(Race)) {}

  async getAll() {
    return this.repo.find({ relations: ["circuit"] });
  }

  async getById(id: number) {
    return this.repo.findOne({ where: { id }, relations: ["circuit"] });
  }

  async create(data: Partial<Race>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<Race>) {
    return this.repo.update(id, data);
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }

  async count() {
    return this.repo.count();
  }
}
