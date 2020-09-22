import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
    selector: '[appPasswordToggle]'
})
export class PasswordToggleDirective implements OnInit {
    private shown = false;

    constructor(private el: ElementRef) { }

    ngOnInit() {
        this.setup();
    }

    setup() {
        const parent = this.el.nativeElement.parentNode;
        const lnk = document.createElement('a');

        parent.classList.add('password-toggle');

        lnk.addEventListener('click', (event) => {
            this.toggle();
        });
        parent.appendChild(lnk);
    }

    toggle() {
        this.shown = !this.shown;
        if (this.shown) {
            this.el.nativeElement.setAttribute('type', 'text');
        } else {
            this.el.nativeElement.setAttribute('type', 'password');
        }
    }
}
