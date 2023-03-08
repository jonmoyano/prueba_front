import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

//Import general para todas las apis
import {API_URI} from '../model/api'

// const API_URI = 'http://localhost:8080/api';
@Injectable({
  providedIn: 'root'
})
export class PreferenceService {

  constructor(private http: HttpClient) { }
  // public preferencias: any[] = [];
  
  public getAllPreferencesOfUser(id_persona: any){
    return this.http.get<any>(API_URI+'/preference/getAllPreferences/'+id_persona);
  }

  public savePreferenceOfUser(id_persona: any, razasId: any[]) {
    return this.http.post<any>(API_URI + '/preference/'+id_persona+'/save', razasId);
  }

  public updatePreferenceOfUser(id_persona: any, razasId: any[]) {
    return this.http.post<any>(API_URI + '/preference/'+id_persona+'/update', razasId);
  }

  //Implementacion para los filtos generales con referencia al parametro de su preferencia..
  public findByTipoByUserLoggin(id_persona: any) {
    return this.http.get<any>(API_URI + '/preference/filter/findBytipoandUserLoggin/'+id_persona);
  }

  public findByrazazDependenceOfTipoAndUserLoggin(id_persona: any, id_tipo: any) {
    return this.http.get<any>(API_URI + '/preference/filter/findByrazazDependenceOfTipoAndUserLoggin/'+id_persona+'/'+id_tipo);
  }
  public findByMisPreferenciasUserLoggin(id_persona: any) {
    return this.http.get<any>(API_URI + '/preference/filter/findMisPreferenciasbypersona/'+id_persona);
  }
}
