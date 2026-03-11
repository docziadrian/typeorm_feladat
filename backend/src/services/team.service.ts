import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Team } from "../entities/entities/Team";

export class TeamService {
  constructor(
    private repo: Repository<Team> = AppDataSource.getRepository(Team),
  ) {}

  async getAll() {
    return this.repo.find();
  }

  async getById(id: number) {
    return this.repo.findOneBy({ id });
  }

  async create(data: Partial<Team>) {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<Team>) {
    return this.repo.update(id, data);
  }

  async delete(id: number) {
    return this.repo.delete(id);
  }

  async count() {
    return this.repo.count();
  }
}
