import { Component, OnInit, Input } from '@angular/core';
import { Party, PointThreshold, Announcement } from 'src/app/domain/common';
import { MessagesService } from 'src/app/services/messages.service';

@Component({
  selector: 'app-party-announcement',
  templateUrl: './party-announcement.component.html',
  styleUrls: ['./party-announcement.component.scss'],
})
export class PartyAnnouncementComponent implements OnInit {

  @Input() party: Party;

  victoryAnnounced = false;
  threshold: PointThreshold | undefined;

  constructor(public messages: MessagesService) {}

  ngOnInit() {}

  toggleAnnouncement() {
    this.victoryAnnounced = !this.victoryAnnounced;
  }

  rotateThreshold() {
    if (this.threshold === undefined) {
      this.threshold = 90;
    } else {
      this.threshold -= 30;
    }

    if (this.threshold < 0) {
      this.threshold = undefined;
    }
  }

  get value(): Announcement | undefined {
    if (!this.victoryAnnounced) {
      return undefined;
    }
    return {lessThan: this.threshold || 120};
  }

}
