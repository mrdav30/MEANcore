import { environment } from '../../../environments/environment';

interface Scripts {
    name: string;
    src: string;
    async?: boolean;
}

export const ScriptStore: Scripts[] = [
    // src can be either local or hosted
    // { name: 'embedly', src: '//cdn.embedly.com/widgets/platform.js' }
    { name: 'gtag', src: 'https://www.googletagmanager.com/gtag/js?id=' + environment.googleAnalyticsID, async: true }
];
