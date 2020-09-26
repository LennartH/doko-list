import { Component, HostListener } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
  ) {
    this.initializeApp();
  }

  @HostListener('contextmenu', ['$event'])
  preventContextMenuGlobally(event: MouseEvent) {
    // Right click events on mobile have button 0 but coordinates (1, 1)
    if (event.button === 0 && event.screenX !== 1 && event.screenY !== 1) {
      event.preventDefault();
    }
  }


  initializeApp() {
    this.platform.ready().then(() => {
      Capacitor.Plugins?.SplashScreen.hide();
    });
  }
}
