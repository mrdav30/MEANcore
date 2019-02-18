import {
    AfterViewInit, Directive, ElementRef, EventEmitter, forwardRef
    , Injector, Input, NgZone, OnInit, Output, ChangeDetectorRef
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl, Validators } from '@angular/forms';

import { ReCaptchaValidatorService } from '../services/recaptcha.service';

declare const grecaptcha: any;

declare global {
    interface Window {
        grecaptcha: any;
        reCaptchaLoad: () => void;
    }
}

export interface ReCaptchaConfig {
    theme?: 'dark' | 'light';
    type?: 'audio' | 'image';
    size?: 'compact' | 'normal';
    tabindex?: number;
}

@Directive({
    selector: '[appRecaptcha]',
    exportAs: 'appRecaptcha',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ReCaptchaDirective),
            multi: true
        },
        ReCaptchaValidatorService
    ]
})
export class ReCaptchaDirective implements OnInit, AfterViewInit, ControlValueAccessor {
    @Input() key: string;
    @Input() config: ReCaptchaConfig = {};
    @Input() lang: string;

    @Output() captchaResponse = new EventEmitter<string>();
    @Output() captchaExpired = new EventEmitter();

    private control: FormControl;
    private widgetId: number;

    private onChange: (value: string) => void;
    private onTouched: (value: string) => void;

    constructor(
        private element: ElementRef,
        private ngZone: NgZone,
        private injector: Injector,
        private ref: ChangeDetectorRef,
        private reCaptchaValidatorService: ReCaptchaValidatorService
    ) { }

    ngOnInit() {
        this.registerReCaptchaCallback();
        this.addScript();
    }

    registerReCaptchaCallback() {
        window.reCaptchaLoad = () => {
            const config = {
                ...this.config,
                sitekey: this.key,
                callback: this.onSuccess.bind(this),
                'expired-callback': this.onExpired.bind(this)
            };
            this.widgetId = this.render(this.element.nativeElement, config);
        };
    }

    ngAfterViewInit() {
        this.control = this.injector.get(NgControl).control;
        this.setValidators();
    }


    // Useful for multiple captcha
    // @returns {number}
    getId() {
        return this.widgetId;
    }

    // tslint:disable-next-line
    writeValue(obj: any): void { }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    // onExpired
    onExpired() {
        this.ngZone.run(() => {
            this.captchaExpired.emit();
            this.onChange(null);
            this.onTouched(null);
        });
    }

    // @param response
    onSuccess(token: string) {
        this.ngZone.run(() => {
            this.verifyToken(token);
            this.captchaResponse.next(token);
            this.onChange(token);
            this.onTouched(token);
        });
    }

    // @param token
    verifyToken(token: string) {
        this.control.setAsyncValidators(this.reCaptchaValidatorService.validateToken(token));
        this.control.updateValueAndValidity();
    }

    // Resets the reCAPTCHA widget.
    reset(): void {
        if (!this.widgetId) {
            return;
        }
        grecaptcha.reset(this.widgetId);
        this.onChange(null);
    }

    //   Gets the response for the reCAPTCHA widget.
    //   @returns {string}
    getResponse(): string {
        if (!this.widgetId) {
            return grecaptcha.getResponse(this.widgetId);
        } else {
            return null;
        }
    }

    // Add the script
    addScript(): void {
        const script = document.createElement('script');
        const lang = this.lang ? '&hl=' + this.lang : '';
        script.src = `https://www.google.com/recaptcha/api.js?onload=reCaptchaLoad&render=explicit${lang}`;
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }

    /**
     * Calling the setValidators doesn't trigger any update or value change event.
     * Therefore, we need to call updateValueAndValidity to trigger the update
     */
    private setValidators(): void {
        this.control.setValidators(Validators.required);
        this.control.updateValueAndValidity();
        this.ref.detectChanges();
    }


    //   Renders the container as a reCAPTCHA widget and returns the ID of the newly created widget.
    //   @param element
    //   @param config
    //   @returns {number}
    private render(element: HTMLElement, config): number {
        return grecaptcha.render(element, config);
    }
}
