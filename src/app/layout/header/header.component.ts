import { Component, OnInit } from '@angular/core';
import { LoadScript } from 'src/app/scripts/load-script';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
//Import de la clase persona..
import { Persona } from '../../model/persona';
import { StorageService } from 'src/app/service/storage.service';
import { Solicitud } from 'src/app/model/solicitud';
import { SolicitudService } from 'src/app/service/solicitud.service';
import { UserService } from 'src/app/service/user.service';
import { ChatService } from 'src/app/service/chat.service';
import { RegisterAnimal } from 'src/app/model/register-animal';
import { AnimalService } from 'src/app/service/animal.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css','./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public solicitud: Solicitud = new Solicitud();
  public solicitudAc: Solicitud = new Solicitud();

  solicitudes: any;
  //creacion de objeto de la clase persona;
  userC: Persona = new Persona();

  //variables don de voy recibir el storage para el login
  id_user?: any;
  nombreUser?: any;

  isUserAdmin: boolean = false;
  isUserNormal: boolean = false;

  rolUser: any;
  numsolicitudes: any;
  listALLSolicituds: any[] = [];

  //Variable para que me permita obtener el ide de usuairo
  public id_usuariologggin: any;

  public id_usuarioAccount: any;

  public picture_userAccount: any;

  public dataUser: any;
  //Implementacion de los items

  public numero_chats: any;
  constructor(
    private httpc: HttpClient,
    private router: Router,
    private solicitudService: SolicitudService,
    private storage: StorageService,
    private userService: UserService,
    private operacionesJS: LoadScript,
    private chatService: ChatService,
    private animalService: AnimalService
  ) {
    operacionesJS.Cargar(['sheader']);
  }
  ngOnInit(): void {
    this.id_usuarioAccount = localStorage.getItem('id_user');
    if (this.id_usuarioAccount != null) {
      this.getUser();
      // this.rolUser = localStorage.getItem('rol');
      this.id_usuariologggin = localStorage.getItem('id_user_person');
      this.picture_userAccount = localStorage.getItem('foto');
      this.getUserAccount(this.id_usuarioAccount);

           //Para mostrar los mendajes en el caso de que los usuario ya tengan un chat.
           this.chatService
           .getByCountChat(this.id_usuariologggin)
           .subscribe((data) => {
             this.numero_chats = data;
             console.log({numero_chat: data})});

      // PROCESO PARA RECIVIR LAS SOLICITUDES
      setInterval(() => {
        this.listarsolicitudes('Pendiente', 1);
      }, 3000);

 
    }
  }

  //Roter de lso chat a los que me puedo rediriguir.
  public routerChatUser(){
    this.router
    .navigate(['/chat'])
    .then(() => {
      window.location.reload();
    });
  }

  //Navegacion de los hacia lso perfiles de los usuarios..
  public redirectToProfileUser(id_persona: any) {
    // location.replace('/usuario/profileuser/profile');
    // this.router.navigate(['/usuario/profileuser/profile', id_persona]);

    this.router
      .navigate(['/usuario/profileuser/profile', id_persona])
      .then(() => {
        window.location.reload();
      });
  }

  public getUserAccount(id_cuenta: any) {
    this.userService.getUserLogginByID(id_cuenta).subscribe((data) => {
      this.dataUser = data;
    });
  }

  public getUser() {
    // this.id_user = localStorage.getItem('id_cliente');
    this.rolUser = localStorage.getItem('rol');
    if (this.rolUser != null) {
      switch (this.rolUser) {
        case 'ADMIN':
          this.isUserAdmin = true;
          this.isUserNormal = false;
          break;
        case 'USUARIO':
          this.isUserAdmin = false;
          this.isUserNormal = true;
          break;
      }
    } else {
    }
  }

  public signOut() {
    this.storage.clean();
    this.router.navigate(['/home']).then(() => {
      window.location.reload();
    });
  }

  listarsolicitudes(e: string, x: number) {
    this.solicitudService
      .getAllSolicitudesByPersonaID(e, this.id_usuariologggin)
      .subscribe((data) => {
        this.solicitudes = data;
        this.numsolicitudes = this.solicitudes.length;
        console.log(this.solicitudes); // Muestra el resultado en la consola
      });
  }

  public updateSolicitudperId(
    id_solicitud: any,
    solicitudAc: any,
    x: number,
    animal: any
  ) {
    console.log(solicitudAc);
    this.solicitudAc = { ...solicitudAc };
    if (x == 1) {
      this.solicitudAc.estado = 'Aceptada';
      //proceso de entrada de datos para enviar al servidor actualizar los datos..
      let valorCalificasion = animal.num_soli;

      let num_s = valorCalificasion + 1;

      this.animalService
        .updateAnimalOfCalification(animal.id_animal, false, num_s)
        .subscribe((data: any) => {
          console.log({ updateanial: data });
        });
    } else if (x == 2) {
      this.solicitudAc.estado = 'Rechazada';
    }
    this.solicitudService
      .EditarSolicitudById(id_solicitud, this.solicitudAc)
      .subscribe(
        (data: any) => {
          console.log('a verrr' + data);

          // Verificar si data es un arreglo
          if (Array.isArray(data)) {
            this.listALLSolicituds = data;
          }
          this.listarsolicitudes('Pendiente', 1);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  //Proceso de creacion del chat con la persona emisora

  public procedureCrearChat(idPersonaReceptor: any): void {
    console.log(this.id_usuariologggin, idPersonaReceptor);

    this.chatService
      .getChatByPersonasInSection(this.id_usuariologggin, idPersonaReceptor)
      .subscribe((data) => {
        console.log({ data });

        console.log('Lo que tengo en el dato->' + data);
        setTimeout(() => {
          if (data == null) {
            console.log('data no hay nada');

            this.chatService
              .createChat(this.id_usuariologggin, idPersonaReceptor)
              .subscribe((chat) => {
                // this.router.navigate(['/chat', chat.id_chat]);
                this.router.navigate(['/chat', chat.id_chat]).then(() => {
                  window.location.reload();
                });
              });
          } else {
            console.log('lo que me impre el chat el ID: ' + data.id_chat);
            this.router.navigate(['/chat', data.id_chat]).then(() => {
              window.location.reload();
            });
          }
        }, 3000);
      });
  }
}
