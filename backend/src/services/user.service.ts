import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { User } from "../entities/";

export class UserService {
  constructor(
    private repo: Repository<User> = AppDataSource.getRepository("User"),
  ) {}

  async createUser(name: string, email: string, password: string) {
    const user = this.repo.create({ name, email, password });
    return this.repo.save(user);
  }

  async listUsers() {
    return this.repo.find();
  }

  async getUserById(id: string) {
    return this.repo.findOneBy({ id });
  }

  async updateUser(id: string, name: string, email: string) {
    return this.repo.update(id, { name, email });
  }

  async deleteUser(id: string) {
    return this.repo.delete(id);
  }

  async getUserWithTasks(id: string) {
    return this.repo.findOne({ where: { id }, relations: ["tasks"] });
  }
}
