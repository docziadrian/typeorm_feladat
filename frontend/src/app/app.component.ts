import { Component, OnInit, NgZone } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet, RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatTabsModule } from "@angular/material/tabs";
import { ApiService } from "./services/api.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTabsModule,
  ],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
  statisztikak = { teams: 0, drivers: 0, circuits: 0, races: 0, results: 0 };
  animaltSzamok = { teams: 0, drivers: 0, circuits: 0, races: 0, results: 0 };

  fulek = [
    { cimke: "Csapatok", utvonal: "/csapatok" },
    { cimke: "Versenyzők", utvonal: "/versenyzok" },
    { cimke: "Pályák", utvonal: "/palyak" },
    { cimke: "Versenyek", utvonal: "/versenyek" },
    { cimke: "Eredmények", utvonal: "/eredmenyek" },
    { cimke: "Pontverseny", utvonal: "/pontverseny" },
  ];

  constructor(
    private apiService: ApiService,
    private ngZone: NgZone,
  ) {}

  ngOnInit() {
    this.adatokBetoltese();
  }

  adatokBetoltese() {
    this.apiService.getDashboard().subscribe((data: any) => {
      this.statisztikak = data;
      this.szamAnimacio("teams", data.teams);
      this.szamAnimacio("drivers", data.drivers);
      this.szamAnimacio("circuits", data.circuits);
      this.szamAnimacio("races", data.races);
      this.szamAnimacio("results", data.results);
    });
  }

  szamAnimacio(kulcs: keyof typeof this.animaltSzamok, celErtek: number) {
    const idotartam = 1000;
    const lepesek = 60;
    const lepesIdo = idotartam / lepesek;
    let aktualisLepes = 0;

    this.animaltSzamok[kulcs] = 0;

    const idozito = setInterval(() => {
      aktualisLepes++;
      const haladas = aktualisLepes / lepesek;
      const lassulas = 1 - Math.pow(1 - haladas, 3);
      this.ngZone.run(() => {
        this.animaltSzamok[kulcs] = Math.round(celErtek * lassulas);
      });

      if (aktualisLepes >= lepesek) {
        this.ngZone.run(() => {
          this.animaltSzamok[kulcs] = celErtek;
        });
        clearInterval(idozito);
      }
    }, lepesIdo);
  }
}
