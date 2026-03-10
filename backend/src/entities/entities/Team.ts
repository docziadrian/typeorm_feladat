import { Column, Entity, Index, OneToMany } from "typeorm";
import { Driver } from "./Driver";
import { RaceResult } from "./RaceResult";

@Index("uq_team_name", ["name"], { unique: true })
@Entity("team", { schema: "2025_forma1" })
export class Team {
  @Column("int", { primary: true, name: "id" })
  id: number;

  @Column("varchar", { name: "name", unique: true, length: 255 })
  name: string;

  @Column("varchar", { name: "base", length: 255 })
  base: string;

  @Column("varchar", { name: "principal", length: 255 })
  principal: string;

  @Column("varchar", { name: "powerUnit", length: 255 })
  powerUnit: string;

  @Column("varchar", { name: "color", length: 32 })
  color: string;

  @OneToMany(() => Driver, (driver) => driver.team)
  drivers: Driver[];

  @OneToMany(() => RaceResult, (raceResult) => raceResult.team)
  raceResults: RaceResult[];
}
