import {
  Component,
  OnInit
} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'app-footer-selector',
  templateUrl: `./app-footer.component.html`,
  styleUrls: [`./app-footer.component.css`]
})

export class AppFooterComponent implements OnInit {
  public expandedIndex: -1;

  constructor() {}

  ngOnInit() { }
}
