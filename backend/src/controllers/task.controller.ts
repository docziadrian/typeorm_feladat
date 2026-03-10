import { TaskService } from "../services/task.service";
import { Request, Response } from "express";


export class TaskController {
    
    constructor(private taskService = new TaskService()){}

    create = async (req: Request, res: Response) => {
        const { title, description, userId } = req.body;
        if (!title || !description || !userId) {
            return res.status(400).json({ message: "Title, description, and userId are required." });
        }
        try {
            const task = await this.taskService.createTask(title, description, userId);
            return res.status(201).json(task);
        } catch (error) {
            console.error("Error creating task:", error);
            return res.status(500).json({ message: "Internal server error." });
        }
    }

    list = async (_req: Request, res: Response) => {
        const tasks = await this.taskService.listTasks();
        return res.json(tasks);
    }

    getById = async (req: Request, res: Response) => {
        if (!req.params.id) {
            return res.status(400).json({ message: "Task ID is required." });
        }                       
        const task = await this.taskService.getTaskById(req.params.id as string);
        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }
        return res.json(task);
    }   

    update = async (req: Request, res: Response) => {
        if (!req.params.id) {
            return res.status(400).json({ message: "Task ID is required." });
        }
        const { title, description, completed } = req.body;
        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required." });
        }
        const result = await this.taskService.updateTask(req.params.id as string, title, description, completed);
        if (result.affected === 0) {
            return res.status(404).json({ message: "Task not found." });
        }
        return res.status(200).json({ message: 'Task updated successfully.' });
    }

    delete = async (req: Request, res: Response) => {
            if (!req.params.id) { 
                return res.status(400).json({ message: "Task ID is required." });
            }
            const result = await this.taskService.deleteTask(req.params.id as string);
            if (result.affected === 0) {
                return res.status(404).json({ message: "Task not found." });
            }
            return res.status(200).json({ message: 'Task deleted successfully.' });
    }           

    listByUser = async (req: Request, res: Response) => {
        if (!req.params.userId) {
            return res.status(400).json({ message: "User ID is required." });
        }
        try {
            const tasks = await this.taskService.listTasksByUser(req.params.userId as string);
            return res.json(tasks);
        } catch (error) {
            console.error("Error listing tasks by user:", error);
            return res.status(500).json({ message: "Internal server error." });
        }
    }

}