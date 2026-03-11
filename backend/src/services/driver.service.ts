import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Driver } from "../entities/entities/Driver";

export class DriverService {
  constructor(private repo: Repository<Driver> = AppDataSource.getRepository(Driver)) {}

  async getAll() {
    return this.repo.find({ relations: ["team"] });
  }

  async getById(id: number) {
    return this.repo.findOne({ where: { id }, relations: ["team"] });
  }

  async create(data: Partial<Driver>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<Driver>) {
    return this.repo.update(id, data);
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }

  async count() {
    return this.repo.count();
  }
}
