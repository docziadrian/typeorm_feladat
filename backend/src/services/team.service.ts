import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Team } from "../entities/entities/Team";

export class TeamService {
  constructor(
    private repo: Repository<Team> = AppDataSource.getRepository("Team"),
  ) {}

  async createTeam(
    name: string,
    base: string,
    principal: string,
    powerUnit: string,
    color: string,
  ) {
    const team = this.repo.create({ name, base, principal, powerUnit, color });
    return this.repo.save(team);
  }

  async listTeams() {
    return this.repo.find();
  }

  async getTeamById(id: number) {
    return this.repo.findOneBy({ id });
  }

  async updateTeam(
    id: number,
    name: string,
    base: string,
    principal: string,
    powerUnit: string,
    color: string,
  ) {
    return this.repo.update(id, { name, base, principal, powerUnit, color });
  }

  async deleteTeam(id: number) {
    return this.repo.delete(id);
  }
}
