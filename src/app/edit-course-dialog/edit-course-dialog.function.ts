import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditCourseDialogData } from './edit-course-dialog.data.model';
import { EditCourseDialogComponent } from './edit-course-dialog.component';
import { firstValueFrom } from 'rxjs';
import { Course } from '../models/course.model';

export async function openEditCourseDialog(
  dialog: MatDialog,
  data: EditCourseDialogData
): Promise<Course> {
  const config = new MatDialogConfig();
  config.disableClose = true;
  config.autoFocus = true;
  config.width = '400px';
  config.data = data;

  const close$ = dialog.open(EditCourseDialogComponent, config).afterClosed();

  return firstValueFrom<Course>(close$);
}
