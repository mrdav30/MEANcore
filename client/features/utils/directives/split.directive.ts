import { Directive, HostListener, forwardRef, Renderer2, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { chain, trim } from 'lodash';

const noop = () => { };  // tslint:disable-line

const SPLIT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SplitDirective),
    multi: true
};

@Directive({
    selector: '[appSplitControl]',
    providers: [SPLIT_VALUE_ACCESSOR]
})
export class SplitDirective implements ControlValueAccessor {
    private onChange: (arg0: string[]) => void;

    private onTouchedCallback: () => void = noop;

    constructor(
        private renderer: Renderer2,
        private element: ElementRef
    ) { }

    @HostListener('input', ['$event.target.value'])
    input(value: any) {
        if (value) {
            this.onChange(
                chain(value)
                    .split(',')
                    .filter((el) => {
                        // filter out null values
                        return el.length > 0;
                    })
                    .map((tag: string) => {
                        // trim whitespace
                        return trim(tag);
                    })
                    .value()
            );
        }
    }

    // From ControlValueAccessor interface
    writeValue(value: any): void {
        if (value) {
            const element = this.element.nativeElement;
            this.renderer.setProperty(element, 'value', value.join(','));
        }
    }

    // From ControlValueAccessor interface
    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    // From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
}
