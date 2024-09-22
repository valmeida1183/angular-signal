import { Injectable, signal } from '@angular/core';
import { Message, MessageSeverity } from '../models/message.model';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  #messageSignal = signal<Message | null>(null);
  message = this.#messageSignal.asReadonly();

  showMessage(text: string, severity: MessageSeverity): void {
    this.#messageSignal.set({ text, severity });
  }

  clearMessage(): void {
    this.#messageSignal.set(null);
  }
}
