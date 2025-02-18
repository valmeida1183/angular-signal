import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '../models/course.model';
import { MatDialog } from '@angular/material/dialog';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.function';

@Component({
  selector: 'courses-card-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './courses-card-list.component.html',
  styleUrl: './courses-card-list.component.scss',
})
export class CoursesCardListComponent {
  courses = input.required<Course[]>();
  courseUpdated = output<Course>();
  courseDeleted = output<string>();

  dialog = inject(MatDialog);

  async onEditCourse(course: Course): Promise<void> {
    const newCCourse = await openEditCourseDialog(this.dialog, {
      mode: 'update',
      title: 'Update Existing Course',
      course,
    });

    console.log(`Course Edited: `, newCCourse);
    this.courseUpdated.emit(newCCourse);
  }

  onDeleteCourse(course: Course): void {
    this.courseDeleted.emit(course.id);
  }
}
