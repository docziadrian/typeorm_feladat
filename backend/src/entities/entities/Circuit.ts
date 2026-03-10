import { Column, Entity, Index, OneToMany } from "typeorm";
import { Race } from "./Race";

@Index("uq_circuit_name", ["name"], { unique: true })
@Entity("circuit", { schema: "2025_forma1" })
export class Circuit {
  @Column("int", { primary: true, name: "id" })
  id: number;

  @Column("varchar", { name: "name", unique: true, length: 255 })
  name: string;

  @Column("varchar", { name: "country", length: 255 })
  country: string;

  @Column("varchar", { name: "city", length: 255 })
  city: string;

  @Column("double", { name: "lengthKm", precision: 22 })
  lengthKm: number;

  @Column("varchar", { name: "lapRecord", length: 64 })
  lapRecord: string;

  @OneToMany(() => Race, (race) => race.circuit)
  races: Race[];
}
