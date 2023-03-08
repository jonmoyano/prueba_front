import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Persona } from '../model/persona';

// const API_URI = 'http://localhost:8080/api';
//Import general para todas las apis
import {API_URI} from '../model/api'

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  constructor(private http: HttpClient) { }

  public getAllPersons() {
    return this.http.get<any>(API_URI + '/persona/listarpersonas');
  }

  public savePerson(persona: Persona) {
    return this.http.post<Persona>(API_URI + '/persona/crearpersona', persona);
  }

  public getPersonById(id_persona: number) {
    return this.http.get<any>(API_URI + '/persona/buscarpersona/' + id_persona);
  }

  public updatePicturePerson(id_persona: any, foto: any) {
    return this.http.put(API_URI + '/persona/updatepicture/' + id_persona, { foto });
  }

  public updatepersona(id_persona: any, persona: Persona) {
    return this.http.put<Persona>(API_URI + '/persona/actualizarpersona/' + id_persona, persona);
  }
  
 
}
