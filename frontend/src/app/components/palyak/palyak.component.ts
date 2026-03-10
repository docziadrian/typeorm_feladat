import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-palyak',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './palyak.component.html',
  styleUrl: './palyak.component.scss'
})
export class PalyakComponent implements OnInit {
  palyaForm: FormGroup;
  palyak: any[] = [];
  displayedColumns: string[] = ['index', 'name', 'country', 'city', 'lengthKm', 'lapRecord', 'actions'];
  isEditMode = false;
  selectedId: string | null = null;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.palyaForm = this.fb.group({
      name: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required],
      lengthKm: [null, [Validators.required, Validators.min(0)]],
      lapRecord: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadPalyak();
  }

  loadPalyak() {
    this.apiService.selectAll('circuits').subscribe((data: any) => {
      this.palyak = data;
    });
  }

  onSubmit() {
    if (this.palyaForm.invalid) return;

    if (this.isEditMode && this.selectedId) {
      this.apiService.update('circuits', this.selectedId, this.palyaForm.value).subscribe(() => {
        this.resetForm();
        this.loadPalyak();
      });
    } else {
      this.apiService.insert('circuits', this.palyaForm.value).subscribe(() => {
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

  deletePalya(id: string) {
    this.apiService.delete('circuits', id).subscribe(() => {
      this.loadPalyak();
    });
  }

  resetForm() {
    this.isEditMode = false;
    this.selectedId = null;
    this.palyaForm.reset();
  }
}
