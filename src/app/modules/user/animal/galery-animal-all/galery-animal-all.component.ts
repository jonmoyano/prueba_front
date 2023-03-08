import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimalService } from 'src/app/service/animal.service';

@Component({
  selector: 'app-galery-animal-all',
  templateUrl: './galery-animal-all.component.html',
  styleUrls: ['./galery-animal-all.component.css', './galery-animal-all.component.scss'],
})
export class GaleryAnimalAllComponent implements OnInit {

  public listALLAnimals: any;

  public id_persona_loggin: any;
  constructor(private animalService: AnimalService,
    private router: Router){}
  ngOnInit(): void {
    this.getFindAllAnimals();
    this.id_persona_loggin = localStorage.getItem('id_user_person');
  }

  //Traer todos los animales
  public getFindAllAnimals() {
    this.animalService.findAllAnimals().subscribe(
      (data: any) => {
        // this.listALLAnimals = data;

        //Metodo para hacer el filtro entre lo animales 
        this.listALLAnimals = data.filter((animal:any) => animal.persona.id_persona != this.id_persona_loggin);
        console.log(this.listALLAnimals);
        console.log(data);

        //Fin del filtro de los animales
      },
      (err) => {
        console.log(err);
      }
    );
  }
  
  public irPerfilAnimalProfile(id_animal: any){
    // alert(id_animal)
    this.router.navigate(['/usuario/perfil/animal', id_animal]);
  }
}
