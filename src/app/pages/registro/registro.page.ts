import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  alertButtons = ['Action'];

  usuario = new FormGroup({
  
    nom_usuario: new FormControl('',[Validators.required,Validators.pattern("[a-z]{3,10}")]),
    contraseña: new FormControl('',[Validators.required]),
    correo: new FormControl('',[Validators.required, Validators.email]),
    rut: new FormControl('',[Validators.required,Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
    fec_nacimiento: new FormControl('',[Validators.required]),
    genero: new FormControl('',[Validators.required]),
    

  });

  constructor(private route: Router) { }

  ngOnInit() {
  }

  public usuario_registrado():void{
    
    console.log(this.usuario.value);
    
    this.route.navigate(['/login']);
  }

}
