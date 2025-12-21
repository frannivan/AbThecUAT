import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-interactive-grid',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './interactive-grid.html',
    styleUrl: './interactive-grid.css',
})
export class InteractiveGrid implements OnInit {
    // Use a smaller grid for "bigger" cells as requested
    gridSize = 144; // 12x12
    cells = signal<number[]>([]);

    ngOnInit() {
        this.cells.set(Array.from({ length: this.gridSize }, (_, i) => i));
    }

    handleHover(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (target.classList.contains('grid-cell')) {
            // Apply a transition color and reduce opacity to reveal background
            target.style.backgroundColor = this.getRandomRevealColor();
            target.style.opacity = '0.3';

            setTimeout(() => {
                // Clear inline styles to revert to CSS defaults (Dark Gray)
                target.style.backgroundColor = '';
                target.style.opacity = '';
            }, 50);
        }
    }

    private getRandomRevealColor(): string {
        const colors = [
            'rgba(16, 185, 129, 0.8)', // emerald
            'rgba(59, 130, 246, 0.8)', // blue
            'rgba(99, 102, 241, 0.8)', // indigo
            'rgba(139, 92, 246, 0.8)', // violet
            'rgba(6, 182, 212, 0.8)',  // cyan
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}
