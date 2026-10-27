import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
  afterNextRender,
  DestroyRef
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  @ViewChild('bgCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private authService = inject(AuthService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  username = '';
  password = '';
  errorMessage = signal<string | null>(null);

  private tubesApp: any = null;
  private clickListener?: (e: MouseEvent) => void;

  constructor() {
    afterNextRender(async () => {
      await this.initTubesEffect();
    });
  }

  private async initTubesEffect() {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    try {
      let module: any;
      try {
        module = await (new Function('url', 'return import(url)'))('/libs/tubes1.min.js');
      } catch {
        module = await (new Function('url', 'return import(url)'))(
          'https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js'
        );
      }

      const TubesCursor = module.default;
      this.tubesApp = TubesCursor(canvas, {
        tubes: {
          colors: ['#f967fb', '#53bc28', '#6958d5'],
          lights: {
            intensity: 200,
            colors: ['#83f36e', '#fe8a2e', '#ff008a', '#60aed5'],
          },
        },
      });

      this.clickListener = (event: MouseEvent) => {
        const target = event.target as HTMLElement | null;
        if (
          target &&
          (target.closest('.card') ||
            target.tagName === 'INPUT' ||
            target.tagName === 'BUTTON')
        ) {
          return;
        }

        if (this.tubesApp?.tubes) {
          const colors = this.randomColors(3);
          const lightsColors = this.randomColors(4);
          this.tubesApp.tubes.setColors(colors);
          this.tubesApp.tubes.setLightsColors(lightsColors);
        }
      };

      window.addEventListener('click', this.clickListener);

      this.destroyRef.onDestroy(() => {
        if (this.clickListener) {
          window.removeEventListener('click', this.clickListener);
        }
        if (this.tubesApp && typeof this.tubesApp.dispose === 'function') {
          this.tubesApp.dispose();
          this.tubesApp = null;
        }
      });
    } catch (err) {
      console.warn('No se pudo inicializar TubesCursor:', err);
    }
  }

  private randomColors(count: number): string[] {
    return new Array(count)
      .fill(0)
      .map(
        () =>
          '#' +
          Math.floor(Math.random() * 16777215)
            .toString(16)
            .padStart(6, '0')
      );
  }

  onLogin() {
    if (!this.username || !this.password) {
      this.errorMessage.set('Por favor, ingresa usuario y contraseña');
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: () => {
        this.errorMessage.set(null);
        this.router.navigate(['/contacts/admin/by-staff']);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.error || 'Error al iniciar sesión');
      },
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
