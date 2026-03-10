import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { ApiService } from "../../services/api.service";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from "@angular/material/dialog";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

@Component({
  selector: "app-tasks",
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: "./tasks.component.html",
  styleUrl: "./tasks.component.scss",
})
export class TasksComponent implements OnInit, AfterViewInit {
  constructor(
    private api: ApiService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) {}

  columns: string[] = [
    "nr",
    "title",
    "description",
    "completed",
    "user",
    "actions",
  ];
  dataSource = new MatTableDataSource<Task>([]);
  users: any[] = [];

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.getTasks();
    this.api.selectAll("users").subscribe((res) => {
      this.users = res as any[];
    });
  }

  getTasks() {
    this.api.selectAll("tasks").subscribe((res) => {
      this.dataSource.data = res as Task[];
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  openDeleteDialog(id: string): void {
    let dialogRef = this.dialog.open(TaskDeleteDialog, {
      width: "350px",
      data: { id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === "yes") {
        this.api.delete("tasks", id).subscribe(() => {
          this.getTasks();
          this.openSnackBar("Task deleted", "Close", "success-snackbar");
        });
      }
    });
  }

  openFormDialog(task?: Task): void {
    let dialogRef = this.dialog.open(TaskFormDialog, {
      width: "400px",
      data: { task, users: this.users },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.action === "save") {
        if (task) {
          this.api.update("tasks", task.id, result.data).subscribe(() => {
            this.getTasks();
            this.openSnackBar(
              "Task updated successfully",
              "Close",
              "success-snackbar",
            );
          });
        } else {
          this.api.insert("tasks", result.data).subscribe(() => {
            this.getTasks();
            this.openSnackBar(
              "Task created successfully",
              "Close",
              "success-snackbar",
            );
          });
        }
      }
    });
  }

  openSnackBar(message: string, action: string, type: string) {
    {
      this.snackBar.open(message, action, {
        duration: 2000,
        panelClass: [type],
      });
    }
  }
}

@Component({
  selector: "task-delete-dialog",
  template: `
    <h1 mat-dialog-title>Delete task</h1>
    <div mat-dialog-content>
      <p>Are you sure you want to delete this task?</p>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="closeDialog('no')">Cancel</button>
      <button mat-button color="warn" (click)="closeDialog('yes')">
        Delete
      </button>
    </div>
  `,
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogTitle,
    MatDialogContent,
  ],
})
export class TaskDeleteDialog {
  constructor(public dialogRef: MatDialogRef<TaskDeleteDialog>) {}
  closeDialog(result: string) {
    this.dialogRef.close(result);
  }
}

@Component({
  selector: "task-form-dialog",
  template: `
    <h2 mat-dialog-title>{{ data.task ? "Edit Task" : "Add Task" }}</h2>
    <mat-dialog-content [formGroup]="form">
      <mat-form-field appearance="fill" style="width: 100%; margin-top: 8px;">
        <mat-label>Title</mat-label>
        <input matInput formControlName="title" required />
      </mat-form-field>
      <mat-form-field appearance="fill" style="width: 100%; margin-top: 8px;">
        <mat-label>Description</mat-label>
        <textarea matInput formControlName="description" required></textarea>
      </mat-form-field>
      <div style="margin-top: 16px;">
        <mat-checkbox formControlName="completed" color="primary"
          >Completed</mat-checkbox
        >
      </div>
      <mat-form-field appearance="fill" style="width: 100%; margin-top: 16px;">
        <mat-label>Assign User</mat-label>
        <mat-select formControlName="userId" required>
          @for (user of data.users; track user.id) {
            <mat-option [value]="user.id"
              >{{ user.name }} ({{ user.email }})</mat-option
            >
          }
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="closeDialog('cancel')">Cancel</button>
      <button
        mat-flat-button
        color="primary"
        (click)="closeDialog('save')"
        [disabled]="form.invalid"
      >
        Save
      </button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
  ],
})
export class TaskFormDialog implements OnInit {
  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<TaskFormDialog>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { task?: Task; users: any[] },
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: [
        this.data.task?.title || "",
        [Validators.required, Validators.maxLength(200)],
      ],
      description: [
        this.data.task?.description || "",
        [Validators.required, Validators.maxLength(500)],
      ],
      completed: [this.data.task?.completed || false],
      userId: [(this.data.task as any)?.user?.id || null, Validators.required],
    });
  }

  closeDialog(result: string) {
    if (result === "save") {
      if (this.form.valid) {
        this.dialogRef.close({ action: "save", data: this.form.value });
      }
    } else {
      this.dialogRef.close();
    }
  }
}
