import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  $IsSmallScreen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private observer: BreakpointObserver) {
    
  }

  ngOnInit(): void {
    this.observer.observe([Breakpoints.XSmall, Breakpoints.Small]).subscribe(val => {
        if (val.matches) {
          this.$IsSmallScreen.next(true);
        } else {
          this.$IsSmallScreen.next(false);
        }
    })
  }
}
