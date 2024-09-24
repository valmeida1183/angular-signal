import { Component, effect, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { Course } from '../models/course.model';
import { EditCourseDialogData } from './edit-course-dialog.data.model';
import { CoursesService } from '../services/courses.service';
import { LoadingIndicatorComponent } from '../loading/loading.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CourseCategoryComboboxComponent } from '../course-category-combobox/course-category-combobox.component';
import { CourseCategory } from '../models/course-category.model';

@Component({
  selector: 'edit-course-dialog',
  standalone: true,
  imports: [
    LoadingIndicatorComponent,
    ReactiveFormsModule,
    CourseCategoryComboboxComponent,
  ],
  templateUrl: './edit-course-dialog.component.html',
  styleUrl: './edit-course-dialog.component.scss',
})
export class EditCourseDialogComponent {
  dialogRef = inject(MatDialogRef);
  data: EditCourseDialogData = inject(MAT_DIALOG_DATA);
  formBuilder = inject(FormBuilder);
  courseService = inject(CoursesService);

  form = this.buildForm();
  category = signal<CourseCategory>('BEGINNER');

  constructor() {
    // this.form.patchValue({
    //   title: this.data?.course?.title,
    //   longDescription: this.data?.course?.longDescription,
    //   category: this.data?.course?.category,
    //   iconUrl: this.data?.course?.iconUrl,
    // });

    this.category.set(this.data?.course?.category ?? 'BEGINNER');

    //This is to see two way signal model in action
    effect(() => {
      console.log(`Course category bi-directional binding: `, this.category());
    });
  }

  ngOnInit(): void {
    this.form.patchValue({
      title: this.data?.course?.title,
      longDescription: this.data?.course?.longDescription,
      iconUrl: this.data?.course?.iconUrl,
    });
  }

  async onSave(): Promise<void> {
    const courseProps = this.form.value as Partial<Course>;
    courseProps.category = this.category();

    if (this.data.mode === 'update') {
      await this.saveCourse(this.data?.course!.id, courseProps);
    } else if (this.data.mode === 'create') {
      await this.createCourse(courseProps);
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }

  private async saveCourse(
    courseId: string,
    changes: Partial<Course>
  ): Promise<void> {
    try {
      const updatedCourse = await this.courseService.saveCourse(
        courseId,
        changes
      );

      this.dialogRef.close(updatedCourse);
    } catch (error) {
      console.error(error);
      alert('Failed to save the course');
    }
  }

  private async createCourse(course: Partial<Course>): Promise<void> {
    try {
      const newCourse = await this.courseService.createCourse(
        course as Omit<Course, 'id'>
      );

      this.dialogRef.close(newCourse);
    } catch (error) {
      console.error(error);
      alert('Failed to create the course');
    }
  }

  private buildForm() {
    return this.formBuilder.group({
      title: [''],
      longDescription: [''],
      iconUrl: [''],
    });
  }
}
