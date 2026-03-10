import { Request, Response } from "express";
import { TeamService } from "../services/team.service";
import bcrypt from "bcrypt";

export class TeamController {
  constructor(private teamService = new TeamService()) {}

  create = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const team = await this.teamService.createTeam(
        name,
        email,
        hashedPassword,
      );
      return res.status(201).json(team);
    } catch (error) {
      console.error("Error creating team:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  };

  list = async (_req: Request, res: Response) => {
    const teams = await this.teamService.listTeams();
    return res.json(teams);
  };

  getById = async (req: Request, res: Response) => {
    if (!req.params.id) {
      return res.status(400).json({ message: "Team ID is required." });
    }
    const team = await this.teamService.getTeamById(req.params.id as number);
    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }
    return res.json(team);
  };

  update = async (req: Request, res: Response) => {
    if (!req.params.id) {
      return res.status(400).json({ message: "Team ID is required." });
    }
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required." });
    }
    const result = await this.teamService.updateTeam(
      req.params.id as number,
      name,
      email,
    );
    if (result.affected === 0) {
      return res.status(404).json({ message: "Team not found." });
    }
    return res.status(200).json({ message: "Team updated successfully." });
  };

  delete = async (req: Request, res: Response) => {
    if (!req.params.id) {
      return res.status(400).json({ message: "Team ID is required." });
    }
    const result = await this.teamService.deleteTeam(req.params.id as number);
    if (result.affected === 0) {
      return res.status(404).json({ message: "Team not found." });
    }
    return res.status(200).json({ message: "Team deleted successfully." });
  };

  getWithTasks = async (req: Request, res: Response) => {
    if (!req.params.id) {
      return res.status(400).json({ message: "Team ID is required." });
    }
    const team = await this.teamService.getTeamById(req.params.id as number);
    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }
    return res.json(team);
  };
}
