import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
    selector: '[appAnimatedLabel]'
})
export class AnimatedLabelDirective implements OnInit {
    private inputParent: HTMLElement;

    constructor(
        private el: ElementRef
    ) { }

    ngOnInit() {
        this.setup();
    }

    setup() {
        this.inputParent = this.el.nativeElement.parentNode;

        this.inputParent.classList.add('animated-label');

        this.el.nativeElement.addEventListener('focus', () => {
            this.inputParent.classList.add('animated-label-focus');
        });
        this.el.nativeElement.addEventListener('blur', () => {
            this.inputParent.classList.remove('animated-label-focus');
            if (this.el.nativeElement.value) {
                this.inputParent.classList.add('animated-label-has-value');
            } else {
                this.inputParent.classList.remove('animated-label-has-value');
            }
        });
    }
}
