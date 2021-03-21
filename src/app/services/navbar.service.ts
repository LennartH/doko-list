import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  private _showSidebar = new BehaviorSubject<boolean>(false);

  get isSidebarVisible(): Observable<boolean> {
    return this._showSidebar.asObservable();
  }

  get showSidebar(): boolean {
    return this._showSidebar.value;
  }

  set showSidebar(value: boolean) {
    this._showSidebar.next(value);
  }

  constructor() {}

  toggleSidebar() {
    this._showSidebar.next(!this._showSidebar.value);
  }
}
