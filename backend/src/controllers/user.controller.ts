import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import bcrypt from  "bcrypt";

export class UserController {
    
    constructor(private userService = new UserService()){}

    create = async (req: Request, res: Response) => {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required." });
        }
        try {
            const hashedPassword = bcrypt.hashSync(password, 10);
            const user = await this.userService.createUser(name, email, hashedPassword);
            return res.status(201).json(user);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(500).json({ message: "Internal server error." });
        }
    }

    list = async (_req: Request, res: Response) => {
        const users = await this.userService.listUsers();
        return res.json(users);
    }

    getById = async (req: Request, res: Response) => {
        if (!req.params.id) {
            return res.status(400).json({ message: "User ID is required." });
        }
        const user = await this.userService.getUserById(req.params.id as string);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        return res.json(user);
    }

    update = async (req: Request, res: Response) => {
        if (!req.params.id) {
            return res.status(400).json({ message: "User ID is required." });
        }
        const { name, email } = req.body;
        if (!name || !email) {
            return res.status(400).json({ message: "Name and email are required." });
        }
        const result = await this.userService.updateUser(req.params.id as string, name, email);
        if (result.affected === 0) {
            return res.status(404).json({ message: "User not found." });
        }
        return res.status(200).json({ message: 'User updated successfully.' });
    }

    delete = async (req: Request, res: Response) => {
            if (!req.params.id) { 
                return res.status(400).json({ message: "User ID is required." });
            }
            const result = await this.userService.deleteUser(req.params.id as string);
            if (result.affected === 0) {
                return res.status(404).json({ message: "User not found." });
            }
            return res.status(200).json({ message: 'User deleted successfully.' });  
    }

    getWithTasks = async (req: Request, res: Response) => {
        if (!req.params.id) {
            return res.status(400).json({ message: "User ID is required." });
        }
        const user = await this.userService.getUserWithTasks(req.params.id as string);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        return res.json(user);
    }

}