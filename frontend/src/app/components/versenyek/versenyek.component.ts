import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-versenyek',
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
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './versenyek.component.html',
  styleUrl: './versenyek.component.scss'
})
export class VersenyekComponent implements OnInit {
  versenyForm: FormGroup;
  versenyek: any[] = [];
  palyak: any[] = [];
  displayedColumns: string[] = ['index', 'round', 'grandPrix', 'date', 'status', 'circuit', 'actions'];
  isEditMode = false;
  selectedId: string | null = null;
  statuses = ['scheduled', 'finished', 'cancelled'];

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.versenyForm = this.fb.group({
      round: [null, [Validators.required, Validators.min(1)]],
      grandPrix: ['', Validators.required],
      date: ['', Validators.required],
      status: ['scheduled', Validators.required],
      circuitId: [null, Validators.required]
    });
  }

  ngOnInit() {
    this.loadVersenyek();
    this.loadPalyak();
  }

  loadVersenyek() {
    this.apiService.selectAll('races').subscribe((data: any) => {
      this.versenyek = data;
    });
  }

  loadPalyak() {
    this.apiService.selectAll('circuits').subscribe((data: any) => {
      this.palyak = data;
    });
  }

  getCircuitName(circuitId: number): string {
    const circuit = this.palyak.find(c => c.id === circuitId);
    return circuit ? circuit.name : '';
  }

  onSubmit() {
    if (this.versenyForm.invalid) return;

    if (this.isEditMode && this.selectedId) {
      this.apiService.update('races', this.selectedId, this.versenyForm.value).subscribe(() => {
        this.resetForm();
        this.loadVersenyek();
      });
    } else {
      this.apiService.insert('races', this.versenyForm.value).subscribe(() => {
        this.resetForm();
        this.loadVersenyek();
      });
    }
  }

  editVerseny(verseny: any) {
    this.isEditMode = true;
    this.selectedId = verseny.id;
    this.versenyForm.patchValue({
        round: verseny.round,
        grandPrix: verseny.grandPrix,
        date: verseny.date,
        status: verseny.status,
        circuitId: verseny.circuitId
    });
  }

  deleteVerseny(id: string) {
    this.apiService.delete('races', id).subscribe(() => {
      this.loadVersenyek();
    });
  }

  resetForm() {
    this.isEditMode = false;
    this.selectedId = null;
    this.versenyForm.reset({ status: 'scheduled' });
  }
}
