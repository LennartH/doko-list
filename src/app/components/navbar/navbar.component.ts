import { Component, Input, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NavbarComponent implements OnInit {

  @Input() navbarTemplateRef: TemplateRef<any>;
  @Input() animationDuration = 0.25;
  @Input() width = window.innerWidth + 'px';

  constructor() {}

  ngOnInit(): void {}
}
