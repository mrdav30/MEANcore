import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessagingService {
  public messages$ = new BehaviorSubject<any>(null);
}
