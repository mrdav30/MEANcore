import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

export interface Window {
  ngRef: string;
}

if (environment.production) {
  enableProdMode();
}

const platform = platformBrowserDynamic();
let configData: any = {};
const APP_BASE = environment.APP_BASE;
const xhr = new XMLHttpRequest();
xhr.open('get', APP_BASE + 'config/get?' + new Date().getTime());
xhr.withCredentials = true;
xhr.onreadystatechange = () => {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      try {
        configData = JSON.parse(xhr.responseText);
      } catch (e) {
        console.log('error parsing JSON response! msg:' + e);
      }
    }
    // setting up cookie for visited site
    document.cookie = 'lastapp=' + configData.APP_BASE + '; expires=Thu, 31 Dec 2099 12:00:00 UTC; path=/';

    platform.bootstrapModule(AppModule(configData))
      .catch(err => console.error(err));
  }
};
xhr.send();
