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
  selector: 'app-eredmenyek',
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
  templateUrl: './eredmenyek.component.html',
  styleUrl: './eredmenyek.component.scss'
})
export class EredmenyekComponent implements OnInit {
  eredmenyForm: FormGroup;
  eredmenyek: any[] = [];
  versenyek: any[] = [];
  versenyzok: any[] = [];
  csapatok: any[] = [];
  displayedColumns: string[] = ['index', 'race', 'driver', 'team', 'position', 'points', 'finishTime', 'fastestLap', 'actions'];
  isEditMode = false;
  selectedId: string | null = null;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.eredmenyForm = this.fb.group({
      raceId: [null, Validators.required],
      driverId: [null, Validators.required],
      teamId: [null, Validators.required],
      position: [null, [Validators.required, Validators.min(1)]],
      points: [null, [Validators.required, Validators.min(0)]],
      finishTime: ['', Validators.required],
      fastestLap: [false]
    });
  }

  ngOnInit() {
    this.loadEredmenyek();
    this.loadAdatok();
  }

  loadEredmenyek() {
    this.apiService.selectAll('results').subscribe((data: any) => {
      this.eredmenyek = data;
    });
  }

  loadAdatok() {
    this.apiService.selectAll('races').subscribe((data: any) => this.versenyek = data);
    this.apiService.selectAll('drivers').subscribe((data: any) => this.versenyzok = data);
    this.apiService.selectAll('teams').subscribe((data: any) => this.csapatok = data);
  }

  getRaceName(raceId: number): string {
    const race = this.versenyek.find(r => r.id === raceId);
    return race ? `${race.round}. ${race.grandPrix}` : '';
  }

  getDriverName(driverId: number): string {
    const driver = this.versenyzok.find(d => d.id === driverId);
    return driver ? `${driver.firstName} ${driver.lastName}` : '';
  }

  getTeamName(teamId: number): string {
    const team = this.csapatok.find(t => t.id === teamId);
    return team ? team.name : '';
  }

  onSubmit() {
    if (this.eredmenyForm.invalid) return;

    if (this.isEditMode && this.selectedId) {
      this.apiService.update('results', this.selectedId, this.eredmenyForm.value).subscribe(() => {
        this.resetForm();
        this.loadEredmenyek();
      });
    } else {
      this.apiService.insert('results', this.eredmenyForm.value).subscribe(() => {
        this.resetForm();
        this.loadEredmenyek();
      });
    }
  }

  editEredmeny(eredmeny: any) {
    this.isEditMode = true;
    this.selectedId = eredmeny.id;
    this.eredmenyForm.patchValue({
      raceId: eredmeny.raceId,
      driverId: eredmeny.driverId,
      teamId: eredmeny.teamId,
      position: eredmeny.position,
      points: eredmeny.points,
      finishTime: eredmeny.finishTime,
      fastestLap: eredmeny.fastestLap
    });
  }

  deleteEredmeny(id: string) {
    this.apiService.delete('results', id).subscribe(() => {
      this.loadEredmenyek();
    });
  }

  resetForm() {
    this.isEditMode = false;
    this.selectedId = null;
    this.eredmenyForm.reset({ fastestLap: false });
  }
}
