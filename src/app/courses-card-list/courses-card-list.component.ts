import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  output,
  viewChildren,
} from '@angular/core';
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
  dialog = inject(MatDialog);

  courses = input.required<Course[]>();
  courseUpdated = output<Course>();
  courseDeleted = output<string>();

  courseCards = viewChildren<ElementRef>('courseCard');

  constructor() {
    effect(() => {
      console.log('courseCards', this.courseCards());
    });
  }

  async onEditCourse(course: Course): Promise<void> {
    const newCourse = await openEditCourseDialog(this.dialog, {
      mode: 'update',
      title: 'Update Existing Course',
      course,
    });

    if (!newCourse) {
      return;
    }

    console.log(`Course Edited: `, newCourse);
    this.courseUpdated.emit(newCourse);
  }

  onDeleteCourse(course: Course): void {
    this.courseDeleted.emit(course.id);
  }
}
