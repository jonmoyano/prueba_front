import { Component, OnInit } from '@angular/core';
import { LoadScript } from '../scripts/load-script';
 import {ConectionService} from '../service/conection.service'

 

@Component({
  selector: 'app-homes',
  templateUrl: './homes.component.html',
  styleUrls: ['./homes.component.css']
})
export class HomesComponent implements OnInit {

  data: any[] = [];
  constructor(private userConection: ConectionService, private operacionesJS: LoadScript) {
    operacionesJS.Cargar(["main"])
  }

  ngOnInit(): void {
    console.log('Holas')
    this.getALll()

    

    //Imple
    
  }

  public getALll() {
    this.userConection.getAll().subscribe((data: any)=>{
      console.log(data)
      this.data = data;
    }, (err)=>{
      console.log('tenemos un error')
    })
  }

}
