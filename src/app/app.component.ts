import { Component, OnInit } from '@angular/core';

//Imports para las rutas en angular


//Rutas con su respecttivos componentes


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'SystemAnimalCoupF';

  visibleSidebar1: any;

  constructor() {
    
  }

  ngOnInit(): void {}
    
}
