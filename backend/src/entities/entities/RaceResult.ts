import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Driver } from "./Driver";
import { Race } from "./Race";
import { Team } from "./Team";

@Index("idx_result_raceId", ["raceId"], {})
@Index("idx_result_driverId", ["driverId"], {})
@Index("idx_result_teamId", ["teamId"], {})
@Entity("race_result")
export class RaceResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int", { name: "position" })
  position: number;

  @Column("int", { name: "points" })
  points: number;

  @Column("varchar", { name: "finishTime", length: 64 })
  finishTime: string;

  @Column("tinyint", { name: "fastestLap", width: 1, default: () => "'0'" })
  fastestLap: boolean;

  @Column("int", { name: "raceId" })
  raceId: number;

  @Column("int", { name: "driverId" })
  driverId: number;

  @Column("int", { name: "teamId" })
  teamId: number;

  @ManyToOne(() => Driver, (driver) => driver.raceResults, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "driverId", referencedColumnName: "id" }])
  driver: Driver;

  @ManyToOne(() => Race, (race) => race.raceResults, {
    onDelete: "CASCADE",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "raceId", referencedColumnName: "id" }])
  race: Race;

  @ManyToOne(() => Team, (team) => team.raceResults, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "teamId", referencedColumnName: "id" }])
  team: Team;
}
