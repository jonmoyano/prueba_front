import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ConfirmationService,
  MessageService,
  PrimeNGConfig,
} from 'primeng/api';
import { EmailService } from 'src/app/service/email.service';
import { SolicitudActivacionService } from 'src/app/service/solicitud-activacion.service';

@Component({
  selector: 'app-recover-and-enabled-account',
  templateUrl: './recover-and-enabled-account.component.html',
  styleUrls: ['./recover-and-enabled-account.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class RecoverAndEnabledAccountComponent implements OnInit {
  recover = {
    identificasion: '',
  };
  constructor(
    private router: Router,
    private emailService: EmailService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private solicitudAcService: SolicitudActivacionService
  ) {}
  ngOnInit(): void {
    this.primengConfig.ripple = true;
  }

  public sendEmailRecoverPassword() {
    this.emailService
      .sendEmailRecoverPassword(this.recover.identificasion)
      .subscribe(
        (data: any) => {
          // la respuesta del servidor se recibe en el parametro 'data'
          console.log('Recuperacion realizada con exito'); // Muestra un mensaje de éxito en la consola
          this.showSuccess(
            'Solicituda de recuperacion de cuentea denviada satisfactoriamente.'
          );
          // aquí puedes realizar otras operaciones con los datos recibidos
        },
        (err: any) => {
          // Si hay un error, se recibe en el parametro 'err'
          switch (err.error) {
            case 'NOT_FOUND':
              this.showError(
                'La cedula y/o RUC no se encuentra en el sistema.'
              );
              console.log('nO encontrado'); // Muestra un mensaje de éxito en la consola

              break;

            default: // Muestra un mensaje de éxito en la consola
              this.showError('Problemas con el servidor');
              console.log('error en el sistema');
              break;
          }
          // console.log('Error al enviar correo: ' + err.message); // Muestra un mensaje de error en la consola
        }
      );
  }

  public recoverActivarionAccount() {
    alert(this.recover.identificasion)
    this.solicitudAcService
      .saveSolicitudesActivacion(this.recover.identificasion)
      .subscribe(data =>{
        console.log({act: data})
      })
  }


  

  //Metodos para mandar los mensajes a la pantalla

  public showSuccess(key: any) {
    this.messageService.add({
      severity: 'success',
      summary: 'Verificado',
      detail: key,
    });
  }

  public showInfo(key: any) {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: key,
    });
  }

  public showWarn(key: any) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warn',
      detail: key,
    });
  }

  public showError(err: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: err,
    });
  }

  onConfirm() {
    this.messageService.clear('c');
  }

  onReject() {
    this.messageService.clear('c');
  }

  clear() {
    this.messageService.clear();
  }
}
