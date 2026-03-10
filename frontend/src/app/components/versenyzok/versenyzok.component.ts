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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-versenyzok',
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
    MatCheckboxModule
  ],
  templateUrl: './versenyzok.component.html',
  styleUrl: './versenyzok.component.scss'
})
export class VersenyzokComponent implements OnInit {
  versenyzoForm: FormGroup;
  versenyzok: any[] = [];
  csapatok: any[] = [];
  displayedColumns: string[] = ['index', 'firstName', 'lastName', 'nationality', 'number', 'team', 'rookie', 'actions'];
  isEditMode = false;
  selectedId: string | null = null;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.versenyzoForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      nationality: ['', Validators.required],
      number: [null, [Validators.required, Validators.min(1)]],
      teamId: [null, Validators.required],
      rookie: [false]
    });
  }

  ngOnInit() {
    this.loadVersenyzok();
    this.loadCsapatok();
  }

  loadVersenyzok() {
    this.apiService.selectAll('drivers').subscribe((data: any) => {
      this.versenyzok = data;
    });
  }

  loadCsapatok() {
    this.apiService.selectAll('teams').subscribe((data: any) => {
      this.csapatok = data;
    });
  }

  getTeamName(teamId: number): string {
    const team = this.csapatok.find(t => t.id === teamId);
    return team ? team.name : '';
  }

  onSubmit() {
    if (this.versenyzoForm.invalid) return;

    if (this.isEditMode && this.selectedId) {
      this.apiService.update('drivers', this.selectedId, this.versenyzoForm.value).subscribe(() => {
        this.resetForm();
        this.loadVersenyzok();
      });
    } else {
      this.apiService.insert('drivers', this.versenyzoForm.value).subscribe(() => {
        this.resetForm();
        this.loadVersenyzok();
      });
    }
  }

  editVersenyzo(versenyzo: any) {
    this.isEditMode = true;
    this.selectedId = versenyzo.id;
    this.versenyzoForm.patchValue({
        firstName: versenyzo.firstName,
        lastName: versenyzo.lastName,
        nationality: versenyzo.nationality,
        number: versenyzo.number,
        teamId: versenyzo.teamId,
        rookie: versenyzo.rookie
    });
  }

  deleteVersenyzo(id: string) {
    this.apiService.delete('drivers', id).subscribe(() => {
      this.loadVersenyzok();
    });
  }

  resetForm() {
    this.isEditMode = false;
    this.selectedId = null;
    this.versenyzoForm.reset({ rookie: false });
  }
}
