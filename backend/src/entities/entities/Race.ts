import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Circuit } from "./Circuit";
import { RaceResult } from "./RaceResult";

@Index("idx_race_circuitId", ["circuitId"], {})
@Entity("race", { schema: "2025_forma1" })
export class Race {
  @Column("int", { primary: true, name: "id" })
  id: number;

  @Column("int", { name: "round" })
  round: number;

  @Column("varchar", { name: "grandPrix", length: 255 })
  grandPrix: string;

  @Column("date", { name: "date" })
  date: string;

  @Column("varchar", { name: "status", length: 64 })
  status: string;

  @Column("int", { name: "circuitId" })
  circuitId: number;

  @ManyToOne(() => Circuit, (circuit) => circuit.races, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "circuitId", referencedColumnName: "id" }])
  circuit: Circuit;

  @OneToMany(() => RaceResult, (raceResult) => raceResult.race)
  raceResults: RaceResult[];
}
