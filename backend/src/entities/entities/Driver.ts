import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Team } from "./Team";
import { RaceResult } from "./RaceResult";

@Index("idx_driver_teamId", ["teamId"], {})
@Entity("driver", { schema: "2025_forma1" })
export class Driver {
  @Column("int", { primary: true, name: "id" })
  id: number;

  @Column("varchar", { name: "firstName", length: 255 })
  firstName: string;

  @Column("varchar", { name: "lastName", length: 255 })
  lastName: string;

  @Column("varchar", { name: "nationality", length: 255 })
  nationality: string;

  @Column("int", { name: "number" })
  number: number;

  @Column("tinyint", { name: "rookie", width: 1, default: () => "'0'" })
  rookie: boolean;

  @Column("int", { name: "teamId" })
  teamId: number;

  @ManyToOne(() => Team, (team) => team.drivers, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "teamId", referencedColumnName: "id" }])
  team: Team;

  @OneToMany(() => RaceResult, (raceResult) => raceResult.driver)
  raceResults: RaceResult[];
}
