import { Component, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatTableModule, MatTableDataSource } from "@angular/material/table";
import { MatPaginatorModule, MatPaginator } from "@angular/material/paginator";
import { ApiService } from "../../services/api.service";

@Component({
  selector: "app-pontverseny",
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatPaginatorModule],
  templateUrl: "./pontverseny.component.html",
  styleUrl: "./pontverseny.component.scss",
})
export class PontversenyComponent implements OnInit {
  versenyzoiTabla = new MatTableDataSource<any>([]);
  konstruktoriTabla = new MatTableDataSource<any>([]);
  @ViewChild("lapozoVersenyzo") lapozoVersenyzo!: MatPaginator;
  @ViewChild("lapozoKonstruktor") lapozoKonstruktor!: MatPaginator;
  versenyzoOszlopok = [
    "pozicio",
    "nev",
    "csapat",
    "pont",
    "gyozelem",
    "dobogo",
  ];
  konstruktorOszlopok = ["pozicio", "csapatNev", "pont", "gyozelem", "dobogo"];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.szamitas();
  }

  szamitas() {
    this.apiService.selectAll("results").subscribe((eredmenyek: any[]) => {
      this.versenyzoSzamitas(eredmenyek);
      this.konstruktorSzamitas(eredmenyek);
    });
  }

  versenyzoSzamitas(eredmenyek: any[]) {
    const map = new Map<number, any>();
    for (const e of eredmenyek) {
      const dId = e.driverId ?? e.driver?.id;
      if (!map.has(dId)) {
        const nev = e.driver
          ? `${e.driver.firstName} ${e.driver.lastName}`
          : `#${dId}`;
        const csapat = e.team?.name ?? "";
        map.set(dId, { nev, csapat, pont: 0, gyozelem: 0, dobogo: 0 });
      }
      const v = map.get(dId)!;
      v.pont += e.points;
      if (e.position === 1) v.gyozelem++;
      if (e.position <= 3) v.dobogo++;
    }
    this.versenyzoiTabla.data = Array.from(map.values()).sort(
      (a, b) => b.pont - a.pont || b.gyozelem - a.gyozelem,
    );
    this.versenyzoiTabla.paginator = this.lapozoVersenyzo;
  }

  konstruktorSzamitas(eredmenyek: any[]) {
    const map = new Map<number, any>();
    for (const e of eredmenyek) {
      const tId = e.teamId ?? e.team?.id;
      if (!map.has(tId)) {
        const csapatNev = e.team?.name ?? "";
        map.set(tId, { csapatNev, pont: 0, gyozelem: 0, dobogo: 0 });
      }
      const v = map.get(tId)!;
      v.pont += e.points;
      if (e.position === 1) v.gyozelem++;
      if (e.position <= 3) v.dobogo++;
    }
    this.konstruktoriTabla.data = Array.from(map.values()).sort(
      (a, b) => b.pont - a.pont || b.gyozelem - a.gyozelem,
    );
    this.konstruktoriTabla.paginator = this.lapozoKonstruktor;
  }

  getSorClass(index: number): string {
    if (index === 0) return "arany-sor";
    if (index === 1) return "ezust-sor";
    if (index === 2) return "bronz-sor";
    return "";
  }
}
