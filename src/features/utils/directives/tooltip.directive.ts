import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[appTooltip]'
})
export class TooltipDirective implements OnInit {
    @Input() meancoreTooltip: any[];

    constructor(private el: ElementRef) { }

    ngOnInit() {
        this.visible('none');
    }

    @HostListener('mouseenter') onMouseEnter() {
        this.visible('block');
    }

    @HostListener('mouseleave') onMouseLeave() {
        this.visible('none');
    }

    private visible(disp: string) {
        this.el.nativeElement.firstElementChild.style.display = disp;
    }
}
