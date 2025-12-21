import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, TranslateModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private translate = inject(TranslateService);

  isMenuOpen = false;
  activeDropdown: string | null = null;
  currentLang = 'es';
  currentTheme = 'auto'; // 'light' | 'dark' | 'auto'

  constructor() {
    this.translate.setDefaultLang('es');
    this.translate.use('es');
    this.initTheme();
  }

  // Theme Logic
  initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'auto';
    this.setTheme(savedTheme, false);
  }

  setTheme(theme: string, save = true) {
    this.currentTheme = theme;
    if (save) localStorage.setItem('theme', theme);

    if (theme === 'dark' || (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  // Language Logic
  switchLanguage(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
    this.activeDropdown = null; // Close dropdown after selection
  }

  getFlagUrl(lang: string): string {
    return lang === 'es'
      ? '/assets/images/flags/mx.png'
      : '/assets/images/flags/gb.png';
  }

  private closeTimeout: any;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.activeDropdown = null;
  }

  toggleDropdown(name: string) {
    this.cancelCloseDropdown(); // Cancel any pending close
    if (this.activeDropdown === name) {
      this.activeDropdown = null;
    } else {
      this.activeDropdown = name;
    }
  }

  closeDropdown() {
    this.activeDropdown = null;
  }

  // UX Improvement: Grace period before closing
  delayedCloseDropdown() {
    this.closeTimeout = setTimeout(() => {
      this.closeDropdown();
    }, 300); // 300ms delay
  }

  cancelCloseDropdown() {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
  }
}
