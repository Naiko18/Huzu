import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  nombre_user: string='';
  contra_user: string='';

  constructor(private route: Router) { }

  ngOnInit() {
  }

  ingresarLogin(){

    if(this.nombre_user == "admin" && this.contra_user == "admin123"){
        this.route.navigate(['/home'])
      }else{

        console.log('Contraseña o usuario incorrectos')

      }
        
      
  }

  
}

