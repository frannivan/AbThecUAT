import { Component, signal, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-interactive-grid',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './interactive-grid.html',
    styleUrl: './interactive-grid.css',
})
export class InteractiveGrid implements OnInit {
    private platformId = inject(PLATFORM_ID);

    // 12x12 grid = 144 cells
    gridSize = 144;
    cells = signal<number[]>([]);

    ngOnInit() {
        this.cells.set(Array.from({ length: this.gridSize }, (_, i) => i));
    }

    // Mobile Touch Support
    handleTouch(event: TouchEvent) {
        if (!isPlatformBrowser(this.platformId)) return;

        // We don't prevent default here to allow scrolling, but users can "scratch" while scrolling
        const touch = event.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);

        if (element && element.id.startsWith('cell-')) {
            const id = parseInt(element.id.split('-')[1], 10);
            if (!isNaN(id)) {
                this.triggerReveal(id);
            }
        }
    }

    private triggerReveal(index: number) {
        if (!isPlatformBrowser(this.platformId)) return;

        const cell = document.getElementById(`cell-${index}`);
        if (cell) {
            // Instant reveal (mimic CSS :hover state)
            cell.style.transition = 'none';
            cell.style.backgroundColor = 'transparent';
            cell.style.opacity = '0';

            // Revert to CSS class transition after a tiny delay
            setTimeout(() => {
                // Clearing inline styles lets the CSS class styles (transition: 15s) take over
                cell.style.transition = '';
                cell.style.backgroundColor = '';
                cell.style.opacity = '';
            }, 50);
        }
    }
}
