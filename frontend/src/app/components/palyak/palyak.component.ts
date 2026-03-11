import { Component, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatTableModule, MatTableDataSource } from "@angular/material/table";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { MatPaginatorModule, MatPaginator } from "@angular/material/paginator";
import { ApiService } from "../../services/api.service";

@Component({
  selector: "app-palyak",
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
    MatPaginatorModule,
  ],
  templateUrl: "./palyak.component.html",
  styleUrl: "./palyak.component.scss",
})
export class PalyakComponent implements OnInit {
  palyaForm: FormGroup;
  palyak = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) lapozoPalya!: MatPaginator;
  displayedColumns: string[] = [
    "index",
    "name",
    "country",
    "city",
    "lengthKm",
    "lapRecord",
    "actions",
  ];
  isEditMode = false;
  selectedId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
  ) {
    this.palyaForm = this.fb.group({
      name: ["", Validators.required],
      country: ["", Validators.required],
      city: ["", Validators.required],
      lengthKm: [null, [Validators.required, Validators.min(0)]],
      lapRecord: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.loadPalyak();
  }

  loadPalyak() {
    this.apiService.selectAll("circuits").subscribe((data: any) => {
      this.palyak.data = data;
      this.palyak.paginator = this.lapozoPalya;
    });
  }

  onSubmit() {
    if (this.palyaForm.invalid) return;

    if (this.isEditMode && this.selectedId) {
      this.apiService
        .update("circuits", this.selectedId, this.palyaForm.value)
        .subscribe(() => {
          this.resetForm();
          this.loadPalyak();
        });
    } else {
      this.apiService.insert("circuits", this.palyaForm.value).subscribe(() => {
        this.resetForm();
        this.loadPalyak();
      });
    }
  }

  editPalya(palya: any) {
    this.isEditMode = true;
    this.selectedId = palya.id;
    this.palyaForm.patchValue(palya);
  }

  deletePalya(id: number) {
    this.apiService.delete("circuits", id).subscribe(() => {
      this.loadPalyak();
    });
  }

  resetForm() {
    this.isEditMode = false;
    this.selectedId = null;
    this.palyaForm.reset();
  }
}
