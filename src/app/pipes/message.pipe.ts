import { Pipe, PipeTransform } from '@angular/core';
import { Message, MessagesService } from '../services/messages.service';

@Pipe({
  name: 'message',
})
export class MessagePipe implements PipeTransform {
  constructor(private messages: MessagesService) {}

  transform(value: string | string[] | Message | Message[], ...args: any[]): string {
    if (typeof value === 'string' || 'key' in value) {
      return this.messages.get(value, ...args);
    }
    if (Array.isArray(value)) {
      const values: any[] = value;
      return values.map((e: string | Message) => this.transform(e, ...args)).join(', ');
    }

    throw new Error(`Illegal argument for message pipe: ${value}`);
  }
}
