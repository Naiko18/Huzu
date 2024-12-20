import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RandomUserService {
  private apiUrl = 'https://randomuser.me/api/';
  
  private catFactsUrl = 'https://catfact.ninja/fact';

  constructor(private http: HttpClient) {}

  getRandomUser(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  obtenerDatoCuriosoGato(): Observable<any> {
    return this.http.get(this.catFactsUrl);
  }
  

}