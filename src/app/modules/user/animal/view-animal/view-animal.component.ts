import { Component, OnInit } from '@angular/core';
import { Persona } from 'src/app/model/persona';
import { SelectItem } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { PersonaService } from 'src/app/service/persona.service';
import { AnimalService } from 'src/app/service/animal.service';
import { TipoService } from 'src/app/service/tipo-animal.service';
import { RazaService } from 'src/app/service/raza-animal.service';
import { PreferenceService } from 'src/app/service/preference.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-animal',
  templateUrl: './view-animal.component.html',
  styleUrls: ['./view-animal.component.css', './view-animal.component.scss'],
})
export class ViewAnimalComponent implements OnInit {
  persona: any[] = [];

  listAnimals: any[] = [];
  listALLAnimals: any[] = [];

  razaAnimal: SelectItem[] = [];

  sortOrder?: number;

  sortField?: string;

  //Control view setvisible in the case view tipos..
  enableViewAllAnimals: boolean = true;

  //Control view setvisible in the case view preferences..
  enableViewPreferences: boolean = false;

  //Control view setvisible in the case view tipos..
  enableViewAllTipos: boolean = false;

  listRazas: any[] = [];
  listTipos: any[] = [];

  val2: number = 3;

  //Valores para las preferencias generales...
  //findByTipoByUserLoggin
  listaTipoPreference: any[] = [];
  listaRazaPreference: any[] = [];
  listaAnimalPreferenceOfPerson: any[] = [];

  selectedRazasIds: any[] = [];

  tipoSeleccionado: any;
  public razaSeleccionado: any;

  public razafinalUserSelected: any;

  //personaLoggin.
  id_user_person: any;

  //Implementacion para el genreo del animal..
  sortOptionsAnimalGender: SelectItem[];

  //Lista de letras para almacenar cada una de ellas asiendo el uso del cosntructor..
  public letter: string[] = [];

  //Esta varible nos sirve para ver el numero 0 de iteracion para el ALL
  public i: number=0;

  //Esta varible nos vera el color del estado del boton en el cual esta iterando
  public selectedLetter: string;

  //Variable para que nos cuente cuanto animales a encontrado
  public numerFoundCountAnimal: number;
  constructor(
    private productService: PersonaService,
    private primengConfig: PrimeNGConfig,
    private animalService: AnimalService,
    private serviceTipoAnimal: TipoService,
    private serviceRazaAnimal: RazaService,
    private servicePreference: PreferenceService,
    private router: Router
  ) {
    //Un for donde vamos a iterar sobre el código ASCCI..
    for (let i = 65; i <= 90; i++) {
      this.letter.push(String.fromCharCode(i));
    }

    //Implementación para gener..
    this.sortOptionsAnimalGender = [
      { label: 'Macho', value: 'Macho' },
      { label: 'Hembra', value: 'Hembra' },
    ];
  }

  ngOnInit() {
    this.id_user_person = localStorage.getItem('id_user_person');
    this.primengConfig.ripple = true;
    this.getAllTiposAnimales();
    this.getFindAllAnimals();

    //Login change
    this.findByTipoByUserLoggin(this.id_user_person);
  }

  //Metodo que nos va hacer el filtro por la letra pertenceciente a cada animal.
  public findByEstadoAndRaAnimal_RazaAnimal_NombretipoStartingWithIgnoreCase(letter: any){
    this.selectedLetter = letter;

    this.animalService.findByEstadoAndRaAnimal_RazaAnimal_NombretipoStartingWithIgnoreCase(letter).subscribe(data=>{
      //this.listALLAnimals = data;
      this.listALLAnimals = data.filter((animal:any) => animal.persona.id_persona != this.id_user_person);
      this.numerFoundCountAnimal = this.listALLAnimals.length;
    });
  }

  //Metodo de busquede por letra.
  public letraSeleccionada:any;
  seleccionarLetra(letra:any) {
    this.letraSeleccionada = letra;
  }
  

  public getAllPreferenceUserDiferentIsLloggin() {
  
    this.servicePreference
      .findByMisPreferenciasUserLoggin(this.id_user_person)
      .subscribe((data) => {
       
        console.log({dataPreferences: data})
        this.listaAnimalPreferenceOfPerson = data;
      });
  }

  //Implementacion del routenign
  public irPerfilAnimalProfile(id_animal: any) {
    // alert(id_animal)
    this.router.navigate(['/usuario/perfil/animal', id_animal]);
  }

  //Implementación de todo del filtro finala para las razasa y los generos..
  public filterGenderAnimalStatus(e: any) {
    console.log('Estamos entrando al evento');
    let cod = e.value;
    console.log({genero: cod})
    // console.log(this.razafinalUserSelected);

    //Implemerentación de la parte que la escojer si es macho o hembra para hacer su devido filtro..
    this.animalService
      .findByGenderAnimal(this.razafinalUserSelected, cod)
      .subscribe((data) => {
        // this.listAnimals = data;
        this.listAnimals = data.filter((animal:any) => animal.persona.id_persona != this.id_user_person);

        // console.log(this.listAnimals);
      });
  }

  //Implementacion todo con referente a las preferencias...........
  public findByTipoByUserLoggin(e: any) {
    this.servicePreference.findByTipoByUserLoggin(e).subscribe((data) => {
      this.listaTipoPreference = data;
      console.log(this.listaTipoPreference);
    });
  }

  public onTipoAnimalChange(event: any) {
    this.tipoSeleccionado = event.target.value;
    console.log('tamos ingreso');

    this.selectedRazasIds.splice(0, this.selectedRazasIds.length); // Limpiar el array
    this.findByrazazDependenceOfTipoAndUserLoggin(
      this.id_user_person,
      this.tipoSeleccionado
    );
  }

  public findByrazazDependenceOfTipoAndUserLoggin(
    id_persona: any,
    id_tipo: any
  ) {
    // let cod = e.value;
    this.servicePreference
      .findByrazazDependenceOfTipoAndUserLoggin(id_persona, id_tipo)
      .subscribe((data) => {
        console.log('Estamos entrando al evento preferencia');
        this.listaRazaPreference = data;
        console.log(this.listaRazaPreference);
        this.listaRazaPreference.forEach((item) => {
          this.selectedRazasIds.push(item[0]);
        });
        this.PreferenceOfUserLoggin(id_tipo);
        console.log(this.selectedRazasIds);
      });
    console.log('[--------------');
    console.log(this.selectedRazasIds);
  }

  public onRazaAnimalChange(event: any) {
    this.razaSeleccionado = event.target.value;
    console.log('tamos ingreso');
    this.animalService
      .getAllAnimalsByRazaID(this.razaSeleccionado)
      .subscribe((data) => {
        // this.listaAnimalPreferenceOfPerson = data;
        this.listaAnimalPreferenceOfPerson = data.filter((animal:any) => animal.persona.id_persona != this.id_user_person);
      });
  }

  public PreferenceOfUserLoggin(id_tipo: any) {
    console.log('--------------');
    console.log(id_tipo);

    this.animalService
      .PreferenceOfUserLoggin(id_tipo, this.selectedRazasIds)
      .subscribe((data) => {
        // console.log({ Estamos_preferencia: data });
        // this.listaAnimalPreferenceOfPerson = data;
        this.listaAnimalPreferenceOfPerson = data.filter((animal:any) => animal.persona.id_persona != this.id_user_person);

        // console.log(this.listaAnimalPreferenceOfPerson);
      });
  }

  //fin de todos los filtos de las prefencias las preferencias.......................
  public valuedataGender: boolean = false;
  public filterPerRazaIsSelected(e: any) {
    console.log('Estamos entrando al evento');
    let cod = e.value;
    this.razafinalUserSelected = cod;
    console.log(cod);
    this.animalService.getAllAnimalsByRazaID(cod).subscribe((data) => {
      // this.listAnimals = data;
      this.listAnimals = data.filter((animal:any) => animal.persona.id_persona != this.id_user_person);

      this.valuedataGender = true;
    });
  }

  //Traer los tipos de animalespublic listarTiAnimal() {
  public getAllTiposAnimales() {
    this.serviceTipoAnimal.getAllTipos().subscribe(
      (data: any) => {
        this.listTipos = data;
        console.log(data);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  //Traer todos los animales
  public getFindAllAnimals() {
    this.selectedLetter = 'AC';
    this.animalService.findAllAnimals().subscribe(
      (data: any) => {
        // this.listALLAnimals = data;
        // console.log(data);
        this.listALLAnimals = data.filter((animal:any) => animal.persona.id_persona != this.id_user_person);
        this.numerFoundCountAnimal = this.listALLAnimals.length;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  public getRazaAnimalByID(id_tipo: any) {
    this.serviceRazaAnimal.findByTipoAnimal(id_tipo).subscribe(
      (data) => {
        this.listRazas = data;
        
        this.razaAnimal = this.listRazas.map((raza) => {
          return { label: raza.nombreraza, value: raza.id_razaanimal };
        });

        // this.listALLAnimals = data.filter((animal:any) => animal.persona.id_persona != this.id_user_person);
        // this.numerFoundCountAnimal = this.listALLAnimals.length;

      },
      (err) => {
        console.log(err);
      }
    );
  }

  public getAllAnimalPerTipo(id_tipo: any) {
    this.animalService
      .getAllAnimalsByTipoID(id_tipo)
      .subscribe((data) => {
        // this.listAnimals = data
        this.listAnimals = data.filter((animal:any) => animal.persona.id_persona != this.id_user_person);

      });
  }

  onSortChange(event: any) {
    let value = event.value;

    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1, value.length);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }

  //Implementacion para que se me haga las busquedas mediante palabras claves.
  //Implementación del metodo incremental del producto por su nombre..
  wordNoFind: string = '';
  public getAllAnimalsPerfilter(e: any) {
    let letter = e.target.value;

    this.wordNoFind = letter;
    console.log(this.wordNoFind);

    if (this.wordNoFind === '') {
      this.getFindAllAnimals();
    } else {
      //Vamos a poner el filtro 3 ya que ese tenemos en el back..
      //.getFilterProduct(3, nombre)
      this.animalService
        .findAllAnimalsIdAndNombreLike(this.wordNoFind)
        .subscribe(
          (data: any) => {
            // this.listALLAnimals = data;
            this.listALLAnimals = data.filter((animal:any) => animal.persona.id_persona != this.id_user_person);
            this.numerFoundCountAnimal = this.listALLAnimals.length;
          },
          (err) => {
            console.log('Tenemos un error');
          }
        );
    }
  }

  //Controles para que las ventanas aparescan y desapararescan, primero para el de todos de los animales
  public setEnableAll(): void {
    this.enableViewAllAnimals = true;
    this.enableViewPreferences = false;
    this.enableViewAllTipos = false;
  }

  //Controles para que las ventanas aparescan y desapararescan, para las preferencias
  public setDisable(): void {
    this.enableViewAllAnimals = false;
    this.enableViewPreferences = true;
    this.enableViewAllTipos = false;
  }

  //Controles para que las ventanas aparescan y desapararescan, cada uno de los tipos
  public setEnable(): void {
    this.enableViewAllAnimals = false;
    this.enableViewPreferences = false;
    this.enableViewAllTipos = true;
  }

  public setDisabledGender() {
    this.valuedataGender = false;
  }
}
