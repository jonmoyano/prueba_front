import { Component } from '@angular/core';
import { Tipo } from 'src/app/model/tipo';
import { TipoService } from 'src/app/service/tipo-animal.service';

import Swal from 'sweetalert2';

//pasos para el pdf..
import * as fileSaver from 'file-saver';

import { DomSanitizer } from '@angular/platform-browser';
import { ReportsService } from 'src/app/service/reports.service';

@Component({
  selector: 'app-register-tipo-animal',
  templateUrl: './register-tipo-animal.component.html',
  styleUrls: ['./register-tipo-animal.component.css'],

})
export class RegisterTipoAnimalComponent {

  tipos: Tipo[] = [];
  public tipo: Tipo = new Tipo();


  constructor(private tipoService: TipoService, private reportService: ReportsService ,public sanitizer: DomSanitizer) { }


  ngOnInit() {
    this.tipoService.getTipos().subscribe(
      tipos => this.tipos = tipos
    );
  }

  //Reportes
  public getReportOfUserRequest(id_tipo: any, name: any) {
    this.reportService.generateReporOftRazaDependenceTipo(id_tipo, name).subscribe((r) => {
  
      const url = URL.createObjectURL(r);
        window.open(url, '_blank');
    });
  }


  display: boolean = false;

  showForm() {
    this.display = true;
  }

  /********************************************************************************************************************************************************************************************/
  //  inicio crud - form-html


  //  listar  
  public enlist(): void {
    this.tipoService.getTipos().subscribe(
      tipos => this.tipos = tipos
    );
  }


  //  crear
  public create(): void {
    let inputNombre: any
    inputNombre = document.getElementById('txt_nombre');
    if (inputNombre && inputNombre.value) {
      this.tipoService.create(this.tipo).subscribe(
        tipo => {
          this.displayMaximizable = false;
          this.showMessageConfirmCreate();
          this.enlist();
        }
      );
    } else {
      alert('Error al guardar el registro');
    }
  }


  //  actualizar
  editTipo(tipo: any) {
    this.tipo = {
      ...tipo,
    };
  }


  //  eliminar
  delete(id: number) {
    Swal.fire({
      title: '¿Seguro que quieres elimnar este registro?',
      showDenyButton: true,
      denyButtonColor: 'rgb(153, 150, 164)',
      denyButtonText: 'Conservar',
      confirmButtonText: 'Eliminar',
      confirmButtonColor: 'rgb(232, 17, 35)'
    }).then((result) => {
      if (result.isConfirmed) {
        this.tipoService.delete(id).subscribe()
        Swal.fire('Registro eliminado', '', 'success')
        this.enlist();
      } else if (result.isDenied) {
        Swal.fire('Ningún cambio efectuado', '', 'info')
      }
    })
  }


  //  convertir archivo a b64
  async convertToBase64(file: File): Promise<string> {
    const reader = new FileReader();
    return new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        const result = btoa(reader.result as string);
        resolve(result);
      };
      reader.onerror = () => {
        reject(reader.error);
      };
      reader.readAsBinaryString(file);
    });
  }

  //  guardar b64 en la database
  async loadPictureTypeAnimal(event: any) {
    const file = event.target.files[0];
    try {
      this.tipo.foto = await this.convertToBase64(file);
    } catch (error) {
      console.error(error);
    }
  }

  //  fin codigo crud-html
  /********************************************************************************************************************************************************************************************/


  /********************************************************************************************************************************************************************************************/
  //  inicio control  - tabla-html

  first = 0;
  rows = 10;
  displayMaximizable?: boolean;
  displayMaximizableDelete?: boolean;

  showMaximizableDialog() {
    this.displayMaximizable = true;
  }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  resetTemplate() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.tipos ? this.first === (this.tipos.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.tipos ? this.first === 0 : true;

  }

  //  fin control  - tabla-html
  /********************************************************************************************************************************************************************************************/


  //      CRUD  - crear
  showMessageConfirmCreate() {
    Swal.fire('Tipo de animal', `"${this.tipo.nombretipo}" guardado con exito`, 'success')
  }

  //    CRUD  - eliminar
  showMessageConfirmDelete() {
    Swal.fire({
      title: '¿Seguro que quieres eliminar este registro?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
    }).then((result) => {
      if (result.isConfirmed) {

        Swal.fire('Registro eliminado', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('Ningún cambio efectuado', '', 'info')
      }
    })
  }

  //  recargar pagina
  reloadPage() {
    window.location.reload();
  }

}





