import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/api';
import { Raza } from 'src/app/model/raza';
import { Tipo } from 'src/app/model/tipo';
import { RazaService } from 'src/app/service/raza-animal.service';
import { TipoService } from 'src/app/service/tipo-animal.service';

//pasos para el pdf..
import * as fileSaver from 'file-saver';

import { DomSanitizer } from '@angular/platform-browser';

import Swal from 'sweetalert2';
import { ReportsService } from 'src/app/service/reports.service';

@Component({
  selector: 'app-register-raza-animal',
  templateUrl: './register-raza-animal.component.html',
  styleUrls: ['./register-raza-animal.component.css'],
})
export class RegisterRazaAnimalComponent implements OnInit {
  public raza: Raza = new Raza();
  public tipo: Tipo = new Tipo();

  razas: Raza[] = [];
  tipos: Tipo[] = [];

  txt_nombre?: string;
  txt_descripcion?: string;

  //Implemntar el filtro para la impresiond de los mejores animales de las personas
  sortOptionsAnimalBestTop: SelectItem[];

  constructor(
    private razaService: RazaService,
    private router: Router,
    private tipoService: TipoService,
    private reportService: ReportsService,
    public sanitizer: DomSanitizer
  ) {
    this.sortOptionsAnimalBestTop = [
      { label: '3 Mejores', value: '3', icon: 'pi pi-print' },
      { label: '5 Mejores', value: '5', icon: 'pi pi-print' },
      { label: '10 Mejores', value: '10', icon: 'pi pi-print' },
    ];
  }

  ngOnInit() {
    this.enlist();
    this.enlistTypes();
  }

  //Imprimir
  public generateReporOftRazaOfBest(id_t: any, e: any, namet: any) {
    console.log('Estamos entrando al evento');
    let cod = e.value;
    console.log(cod.value);

    this.reportService
      .generateReporOftRazaOfBest(id_t, cod.value, namet)
      .subscribe((r) => {
        const url = URL.createObjectURL(r);
        window.open(url, '_blank');
      });
  }

  /******************************************************************************* */

  //  listar
  public enlist(): void {
    this.razaService.getRazas().subscribe((razas) => (this.razas = razas));
  }

  //  crear
  public create(): void {
    let inputNombre: any;
    inputNombre = document.getElementById('txt_nombre');
    if (inputNombre && inputNombre.value) {
      this.raza.razaAnimal = this.tipo;
      this.razaService.create(this.raza).subscribe((tipo) => {
        this.displayMaximizable = false;
        this.showMessageConfirmCreate();
        this.enlist();
        this.enlistTypes();
      });
    } else {
      alert('Error al guardar el registro');
    }
  }

  //  actualizar
  editRaza(raza: any) {
    this.raza = {
      ...raza,
    };
  }

  //  eliminar
  delete(id: number) {
    Swal.fire({
      title: '??Seguro que quieres elimnar este registro?',
      showDenyButton: true,
      denyButtonColor: 'rgb(153, 150, 164)',
      denyButtonText: 'Conservar',
      confirmButtonText: 'Eliminar',
      confirmButtonColor: 'rgb(232, 17, 35)',
    }).then((result) => {
      if (result.isConfirmed) {
        this.razaService.delete(id).subscribe();
        Swal.fire('Registro eliminado', '', 'success');
        this.enlist();
      } else if (result.isDenied) {
        Swal.fire('Ning??n cambio efectuado', '', 'info');
      }
    });
  }

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
    return this.razas ? this.first === this.razas.length - this.rows : true;
  }

  isFirstPage(): boolean {
    return this.razas ? this.first === 0 : true;
  }
  //  fin control  - tabla-html
  /********************************************************************************************************************************************************************************************/

  //      CRUD  - crear
  showMessageConfirmCreate() {
    Swal.fire(
      'Tipo de animal',
      `"${this.raza.nombreraza}" guardado con exito`,
      'success'
    );
  }

  //    CRUD  - eliminar
  showMessageConfirmDelete() {
    Swal.fire({
      title: '??Seguro que quieres eliminar este registro?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Registro eliminado', '', 'success');
        console.log('success');
      } else if (result.isDenied) {
        Swal.fire('Ning??n cambio efectuado', '', 'info');
      }
    });
  }

  //  recargar pagina
  reloadPage() {
    window.location.reload();
  }

  //      ************************* tipos
  categoriaProduct(e: any) {
    let id_cate = e.target.value;

    this.tipo.id_tipoanimal = id_cate;
    this.tipoService
      .searchById(this.tipo.id_tipoanimal)
      .subscribe((data: any) => {
        this.tipo = data;
      });
  }

  public enlistTypes(): void {
    this.tipoService.getTipos().subscribe((tipos) => (this.tipos = tipos));
  }
}
