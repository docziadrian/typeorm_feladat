import { Routes } from "@angular/router";
import { CsapatokComponent } from "./components/csapatok/csapatok.component";
import { VersenyzokComponent } from "./components/versenyzok/versenyzok.component";
import { PalyakComponent } from "./components/palyak/palyak.component";
import { VersenyekComponent } from "./components/versenyek/versenyek.component";
import { EredmenyekComponent } from "./components/eredmenyek/eredmenyek.component";
import { PontversenyComponent } from "./components/pontverseny/pontverseny.component";

export const routes: Routes = [
  { path: "csapatok", component: CsapatokComponent },
  { path: "versenyzok", component: VersenyzokComponent },
  { path: "palyak", component: PalyakComponent },
  { path: "versenyek", component: VersenyekComponent },
  { path: "eredmenyek", component: EredmenyekComponent },
  { path: "pontverseny", component: PontversenyComponent },
  { path: "", redirectTo: "csapatok", pathMatch: "full" },
];
