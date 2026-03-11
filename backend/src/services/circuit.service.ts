import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Circuit } from "../entities/entities/Circuit";

export class CircuitService {
  constructor(private repo: Repository<Circuit> = AppDataSource.getRepository(Circuit)) {}

  async getAll() {
    return this.repo.find();
  }

  async getById(id: number) {
    return this.repo.findOneBy({ id });
  }

  async create(data: Partial<Circuit>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<Circuit>) {
    return this.repo.update(id, data);
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }

  async count() {
    return this.repo.count();
  }
}
