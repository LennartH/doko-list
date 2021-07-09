import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavbarService {
  private _showNavbar = new BehaviorSubject<boolean>(false);

  get isNavbarVisible(): Observable<boolean> {
    return this._showNavbar.asObservable();
  }

  get showNavbar(): boolean {
    return this._showNavbar.value;
  }

  set showNavbar(value: boolean) {
    this._showNavbar.next(value);
  }

  constructor() {}

  toggleNavbar() {
    this._showNavbar.next(!this._showNavbar.value);
  }
}
