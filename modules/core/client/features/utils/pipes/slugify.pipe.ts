import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'slugify' })
export class SlugifyPipe implements PipeTransform {
    transform(input) {
        if (!input) {
            return;
        } else {
            // make lower case and trim
            let slug = input.toLowerCase().trim();

            // replace invalid chars with spaces
            slug = slug.replace(/[^a-z0-9\s-]/g, ' ');

            // replace multiple spaces or hyphens with a single hyphen
            slug = slug.replace(/[\s-]+/g, '-');

            return slug;
        }
    }
}
