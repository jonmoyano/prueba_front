import { Injectable } from '@angular/core';

//Cliente de angular
import { HttpClient } from "@angular/common/http"

//Constante de la API
import {API_URI} from '../model/api'
// const API_URI = 'http://localhost:8080/api';
@Injectable({
  providedIn: 'root'
})
export class SolicitudActivacionService {

  constructor(private http: HttpClient) { }

  public getSolicitudesActivacion(){
    return this.http.get<any>(API_URI+'/solicitud/ativacion/listarsolicitudesdActivacion');
  }

  public saveSolicitudesActivacion(cedula: any){
    return this.http.get<any>(API_URI+'/solicitud/ativacion/solicitarActivacion/'+cedula);
  }

  public updateSolicitudesActivacion(id_solicitud: any, solicitudA: any){
    return this.http.put<any>(API_URI+'/solicitud/ativacion/updatesolicitud/accepSolicitude/'+id_solicitud, solicitudA);
  }
}
