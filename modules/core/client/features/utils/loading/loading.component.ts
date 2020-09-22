import { Component, OnDestroy } from '@angular/core';
import { LoadingService } from './loading.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  moduleId: module.id,
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnDestroy {
  public loading$: BehaviorSubject<any>;

  constructor(private loadingService: LoadingService) {
    this.loading$ = this.loadingService.loading$;
  }

  ngOnDestroy() {
    if (this.loading$) {
      this.loading$.unsubscribe();
    }
  }
}
