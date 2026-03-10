import { Routes } from "@angular/router";
import { UsersComponent } from "./components/users/users.component";
import { TasksComponent } from "./components/tasks/tasks.component";
import { CsapatokComponent } from "./components/csapatok/csapatok.component";

export const routes: Routes = [
  {
    path: "csapatok",
    component: CsapatokComponent,
  },
  {
    path: "tasks",
    component: TasksComponent,
  },
  {
    path: "",
    redirectTo: "csapatok",
    pathMatch: "full",
  },
];
