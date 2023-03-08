import { Injectable } from '@angular/core';

//Cliente de angular
import { HttpClient } from "@angular/common/http"

//Constante de la API
import {API_URI} from '../model/api'

@Injectable({
  providedIn: 'root'
})
export class ConectionService {

  constructor(private http: HttpClient) { }

  public getAll(){
    return this.http.get(API_URI+'/persona/listarpersonas')
  }
  
}
