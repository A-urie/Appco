import { AfterViewInit, Component } from '@angular/core';

const SCRIPTS = [
  'js/jquery-3.6.1.min.js',
  'js/bootstrap.bundle.min.js',
  'js/jquery.magnific-popup.min.js',
  'js/jquery.easing.min.js',
  'js/wow.min.js',
  'js/owl.carousel.min.js',
  'js/jquery.countdown.min.js',
  'js/validator.min.js',
  'js/scripts.js',
];

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements AfterViewInit {
  async ngAfterViewInit(): Promise<void> {
    for (const src of SCRIPTS) {
      await this.loadScript(src);
    }
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Impossible de charger ' + src));
      document.body.appendChild(script);
    });
  }
}