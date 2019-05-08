import { Component, OnInit, ViewChild, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';

import { merge } from 'lodash';

import { ProfileService } from '../../utils/services/profile.service';
import { Profile } from './profile';

@Component({
    moduleId: module.id,
    selector: 'app-profile-form-selector',
    templateUrl: `./profile-form.component.html`,
    encapsulation: ViewEncapsulation.None // required to style innerHtml
})

export class ProfileFormComponent implements OnInit {
    @ViewChild('username') username: NgModel;
    @ViewChild('password') password: NgModel;
    public profile: Profile;
    public possibleUsername: string;
    public passwordTooltip: string;
    public passwordErrors: string[];

    constructor(
        private router: Router,
        private cdr: ChangeDetectorRef,
        private profileService: ProfileService
    ) { }

    ngOnInit(): void {
        this.profile = new Profile();
        this.profileService.GetCurrent()
            .subscribe((data: any) => {
                if (data && data.profile) {
                    this.profile = merge(new Profile(), data.profile) as Profile;
                } else {
                    this.router.navigate(['/home']);
                }
            }, (error) => {
                alert('Error loading page');
                this.router.navigate(['/home']);
            });
    }

    setPasswordValidation(passwordValidation: any): void {
        this.passwordTooltip = passwordValidation.passwordTooltip;
        this.passwordErrors = passwordValidation.errorMessages;
        if (this.password && !this.password.control.pristine) {
            if (passwordValidation.status) {
                this.password.control.setErrors({ incorrect: true });
            } else {
                this.password.control.setErrors(null);
            }
        }
        this.cdr.detectChanges();
    }

    onSubmit(): void {
        this.profileService.Update(this.profile).subscribe((data: any) => {
            if (data && data.userExists) {
                this.possibleUsername = data.possibleUsername;
                this.username.control.setErrors({ alreadyused: true });
            } else {
                this.profile.password = '';
            }
        }, (error) => {
            alert('Error updating profile');
            this.router.navigate(['/home']);
        });
    }
}
