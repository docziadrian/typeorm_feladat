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
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

export interface User {
  id: string;
  name: string;
  email: string;
}

@Component({
  selector: "app-users",
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: "./users.component.html",
  styleUrl: "./users.component.scss",
})
export class UsersComponent implements OnInit, AfterViewInit {
  constructor(
    private api: ApiService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  columns: string[] = ["nr", "name", "email", "actions"];

  dataSource = new MatTableDataSource<User>([]);

  ngOnInit(): void {
    this.getUsers();
  }

  openDialog(id: string): void {
    let dialogRef = this.dialog.open(UserDeleteDialog, {
      width: "350px",
      data: { id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === "yes") {
        this.api.delete("users", id).subscribe(() => {
          this.getUsers();
          this.openSnackBar("User deleted", "Close", "success-snackbar");
        });
      }
    });
  }

  openFormDialog(user?: User): void {
    let dialogRef = this.dialog.open(UserFormDialog, {
      width: "400px",
      data: { user },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.action === "save") {
        if (user) {
          this.api.update("users", user.id, result.data).subscribe(() => {
            this.getUsers();
            this.openSnackBar(
              "User updated successfully",
              "Close",
              "success-snackbar",
            );
          });
        } else {
          this.api.insert("users", result.data).subscribe(() => {
            this.getUsers();
            this.openSnackBar(
              "User created successfully",
              "Close",
              "success-snackbar",
            );
          });
        }
      }
    });
  }

  getUsers() {
    this.api.selectAll("users").subscribe((res) => {
      this.dataSource.data = res as User[];
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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
  selector: "user-delete-dialog",
  templateUrl: "userDeleteDialog.html",
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogTitle,
    MatDialogContent,
  ],
})
export class UserDeleteDialog {
  constructor(public dialogRef: MatDialogRef<UserDeleteDialog>) {}

  closeDialog(result: string) {
    this.dialogRef.close(result);
  }
}

@Component({
  selector: "user-form-dialog",
  template: `
    <h2 mat-dialog-title>{{ data.user ? "Edit User" : "Add User" }}</h2>
    <mat-dialog-content [formGroup]="form">
      <mat-form-field appearance="fill" style="width: 100%; margin-top: 8px;">
        <mat-label>Name</mat-label>
        <input matInput formControlName="name" required />
      </mat-form-field>
      <mat-form-field appearance="fill" style="width: 100%; margin-top: 8px;">
        <mat-label>Email</mat-label>
        <input matInput formControlName="email" type="email" required />
      </mat-form-field>
      @if (!data.user) {
        <mat-form-field appearance="fill" style="width: 100%; margin-top: 8px;">
          <mat-label>Password</mat-label>
          <input matInput formControlName="password" type="password" required />
        </mat-form-field>
      }
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
  ],
})
export class UserFormDialog implements OnInit {
  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<UserFormDialog>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { user?: User },
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: [
        this.data.user?.name || "",
        [Validators.required, Validators.maxLength(100)],
      ],
      email: [
        this.data.user?.email || "",
        [Validators.required, Validators.email, Validators.maxLength(100)],
      ],
      password: [
        "",
        this.data.user ? [] : [Validators.required, Validators.minLength(6)],
      ],
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
