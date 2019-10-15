import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { environment } from '../../../environments/environment';

@Injectable()
export class SeoService {
    private siteName = environment.appName;
    private twitterHandle = environment.twitterHandle;
    private metaTitleSuffix = environment.metaTitleSuffix;

    constructor(
        private titleService: Title,
        private meta: Meta
    ) {
        this.meta.addTags([
            { name: 'description', content: '' },
            { name: 'author', content: '' },
            { name: 'keywords', content: '' },
            { name: 'twitter:card', content: '' },
            { name: 'twitter:site', content: '' },
            { name: 'twitter:title', content: '' },
            { name: 'twitter:description', content: '' },
            { name: 'twitter:image', content: '' },
            { property: 'og:type', content: '' },
            { property: 'og:site_name', content: '' },
            { property: 'og:title', content: '' },
            { property: 'og:description', content: '' },
            { property: 'og:image', content: '' },
            { property: 'og:url', content: '' }
        ], false);
    }

    generateTags(config) {
        // default values
        config = {
            title: '',
            description: '',
            image: '',
            url: '',
            author: '',
            keywords: '',
            ...config
        };

        this.titleService.setTitle(config.title);

        this.meta.updateTag({ name: 'title', content: config.title + ' ' + this.metaTitleSuffix });
        this.meta.updateTag({ name: 'description', content: config.description });
        this.meta.updateTag({ name: 'author', content: config.author });
        this.meta.updateTag({ name: 'keywords', content: config.keywords });

        this.meta.updateTag({ name: 'twitter:card', content: 'summary' });
        this.meta.updateTag({ name: 'twitter:site', content: this.twitterHandle });
        this.meta.updateTag({ name: 'twitter:title', content: config.title });
        this.meta.updateTag({ name: 'twitter:description', content: config.description });
        this.meta.updateTag({ name: 'twitter:creator', content: this.twitterHandle });
        this.meta.updateTag({ name: 'twitter:image', content: config.image });

        this.meta.updateTag({ property: 'og:type', content: config.type || 'article' });
        this.meta.updateTag({ property: 'og:site_name', content: this.siteName });
        this.meta.updateTag({ property: 'og:title', content: config.title });
        this.meta.updateTag({ property: 'og:description', content: config.description });
        this.meta.updateTag({ property: 'og:image', content: config.image });
        this.meta.updateTag({ property: 'og.image:type', content: 'png' });
        this.meta.updateTag({ property: 'og:image:width', content: '750' });
        this.meta.updateTag({ property: 'og:image:height', content: '500' });
        this.meta.updateTag({ property: 'og:url', content: config.url });
    }
}
