import { Component, inject, input, output } from '@angular/core';
import { Lesson } from '../../models/lesson.model';
import { ReactiveFormsModule } from '@angular/forms';
import { LessonsService } from '../../services/lessons.service';
import { MessagesService } from '../../messages/messages.service';

@Component({
  selector: 'lesson-detail',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './lesson-detail.component.html',
  styleUrl: './lesson-detail.component.scss',
})
export class LessonDetailComponent {
  lessonService = inject(LessonsService);
  messagesService = inject(MessagesService);

  lesson = input.required<Lesson | null>();
  lessonUpdated = output<Lesson>();
  cancel = output();

  async onSave(description: string): Promise<void> {
    try {
      const lesson = this.lesson();
      const updatedLesson = await this.lessonService.saveLesson(lesson!.id, {
        description,
      });

      this.lessonUpdated.emit(updatedLesson);
    } catch (error) {
      console.error(error);
      this.messagesService.showMessage(`Error saving lesson!`, 'error');
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
