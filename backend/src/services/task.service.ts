import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Task } from "../entities/task.entity";
import { User } from "../entities/user.entity";


export class TaskService {

    constructor(
        private taskRepo: Repository<Task> = AppDataSource.getRepository("Task"),
        private userRepo: Repository<User> = AppDataSource.getRepository("User")
    ) { };

    async createTask(title: string, description: string, userId: string) {
        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user) throw new Error("User not found");

        const task = this.taskRepo.create({ title, description, user });
        return this.taskRepo.save(task);
    }

    async listTasks() {
        return this.taskRepo.find({ relations: ['user'] });
    }

    async getTaskById(id: string) {
        return this.taskRepo.findOneBy({ id });
    }

    async updateTask(id: string, title: string, description: string, completed: boolean) {
        return this.taskRepo.update(id, { title, description, completed });
    }

    async deleteTask(id: string) {
        return this.taskRepo.delete(id);
    }

    async listTasksByUser(userId: string) {
        const user = await this.userRepo.findOneBy({ id: userId });
        if (!user) throw new Error("User not found");

        return this.taskRepo.find({ where: { user: { id: userId } } });
    }
}