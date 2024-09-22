import { Component, inject } from '@angular/core';
import { MessagesService } from './messages.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  imports: [NgClass],
  standalone: true,
})
export class MessagesComponent {
  messageService = inject(MessagesService);
  message = this.messageService.message;

  onClose(): void {
    this.messageService.clearMessage();
  }
}
