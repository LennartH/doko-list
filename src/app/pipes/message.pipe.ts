import { Pipe, PipeTransform } from '@angular/core';
import { MessagesService } from '../services/messages.service';

@Pipe({
  name: 'message'
})
export class MessagePipe implements PipeTransform {

  constructor(private messages: MessagesService) {}

  transform(value: any): string {
    if (typeof value === 'string') {
      return this.messages.get(value);
    }
    if ('length' in value) {
      return value.map(e => this.transform(e)).join(', ');
    }
  }

}
