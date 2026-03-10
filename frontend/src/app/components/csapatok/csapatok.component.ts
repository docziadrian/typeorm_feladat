import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { ApiService } from "../../services/api.service";

@Component({
  selector: "app-csapatok",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  templateUrl: "./csapatok.component.html",
  styleUrl: "./csapatok.component.scss",
})
export class CsapatokComponent implements OnInit {
  csapatForm: FormGroup;
  csapatok: any[] = [];
  displayedColumns: string[] = [
    "index",
    "name",
    "base",
    "principal",
    "powerUnit",
    "color",
    "actions",
  ];
  isEditMode = false;
  selectedId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
  ) {
    this.csapatForm = this.fb.group({
      name: ["", Validators.required],
      base: ["", Validators.required],
      principal: ["", Validators.required],
      powerUnit: ["", Validators.required],
      color: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.loadCsapatok();
  }

  loadCsapatok() {
    this.apiService.selectAll("teams").subscribe((data: any) => {
      this.csapatok = data;
    });
  }

  onSubmit() {
    if (this.csapatForm.invalid) return;

    if (this.isEditMode && this.selectedId) {
      this.apiService
        .update("teams", this.selectedId, this.csapatForm.value)
        .subscribe(() => {
          this.resetForm();
          this.loadCsapatok();
        });
    } else {
      this.apiService.insert("teams", this.csapatForm.value).subscribe(() => {
        this.resetForm();
        this.loadCsapatok();
      });
    }
  }

  editCsapat(csapat: any) {
    this.isEditMode = true;
    this.selectedId = csapat.id;
    this.csapatForm.patchValue(csapat);
  }

  deleteCsapat(id: string) {
    this.apiService.delete("teams", id).subscribe(() => {
      this.loadCsapatok();
    });
  }

  resetForm() {
    this.isEditMode = false;
    this.selectedId = null;
    this.csapatForm.reset();
  }
}
