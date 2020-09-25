import { Pipe, PipeTransform } from '@angular/core';
import { MessagesService } from '../services/messages.service';

@Pipe({
  name: 'message'
})
export class MessagePipe implements PipeTransform {

  constructor(private messages: MessagesService) {}

  transform(value: string | string[], ...args: any[]): string {
    if (typeof value === 'string') {
      return this.messages.get(value, ...args);
    }
    if ('length' in value) {
      return value.map(e => this.transform(e, ...args)).join(', ');
    }
  }

}
