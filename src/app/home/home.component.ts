import {
  Component,
  computed,
  effect,
  EffectRef,
  ElementRef,
  inject,
  Injector,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Course, sortCoursesBySeqNo } from '../models/course.model';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { CoursesCardListComponent } from '../courses-card-list/courses-card-list.component';
import { MatDialog } from '@angular/material/dialog';
import { MessagesService } from '../messages/messages.service';
import { catchError, from, throwError } from 'rxjs';
import {
  toObservable,
  toSignal,
  outputToObservable,
  outputFromObservable,
} from '@angular/core/rxjs-interop';
import { CoursesServiceWithFetch } from '../services/courses-fetch.service';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.function';

type Example = {
  value: number;
};

@Component({
  selector: 'home',
  standalone: true,
  imports: [MatTabGroup, MatTab, CoursesCardListComponent, MatTooltipModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  courseService = inject(CoursesService);
  messageService = inject(MessagesService);
  dialog = inject(MatDialog);

  #courses = signal<Course[]>([]);

  beginnerCourses = computed(() => {
    const courses = this.#courses();

    return courses.filter((course) => course.category === 'BEGINNER');
  });

  advancedCourses = computed(() => {
    const courses = this.#courses();

    return courses.filter((course) => course.category === 'ADVANCED');
  });

  beginnersList = viewChild('beginnersList', { read: ElementRef });
  matTooltip = viewChild('addButton', { read: MatTooltip });

  constructor() {
    /*Todo verificar as opções:
      - afterNextRender
      - afterRender
    */

    effect(() => {
      console.log(`beginnerList: `, this.beginnersList());
    });

    effect(() => {
      console.log(`matTooltip: `, this.matTooltip());
    });

    effect(() => {
      console.log(`Beginner courses: `, this.beginnerCourses());
      console.log(`Advanced courses: `, this.advancedCourses());
    });
  }

  ngOnInit(): void {
    this.loadAllCourses();
  }

  async loadAllCourses() {
    try {
      const courses = await this.courseService.loadAllCourses();
      this.#courses.set(courses.sort(sortCoursesBySeqNo));
    } catch (error) {
      this.messageService.showMessage(`Error loading courses!`, 'error');
      console.error(error);
    }
  }

  async onAddCourse(): Promise<void> {
    const newCourse = await openEditCourseDialog(this.dialog, {
      mode: 'create',
      title: 'Create New Course',
    });

    if (!newCourse) {
      return;
    }

    const newCourses = [...this.#courses(), newCourse];

    this.#courses.set(newCourses);
  }

  onCourseUpdated(updatedCourse: Course): void {
    const courses = this.#courses();
    const newCourses = courses.map((course) => {
      return course.id === updatedCourse.id ? updatedCourse : course;
    });

    this.#courses.set(newCourses);
  }

  async onCourseDeleted(courseId: string): Promise<void> {
    try {
      await this.courseService.deleteCourse(courseId);

      const courses = this.#courses();
      const newCourses = courses.filter((course) => {
        return course.id !== courseId;
      });

      this.#courses.set(newCourses);
    } catch (error) {
      console.error(error);
      alert(`Error deleting course!`);
    }
  }
}
