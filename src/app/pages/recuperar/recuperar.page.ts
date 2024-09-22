import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {

  alertButtons = ['Action'];

  recuperar = new FormGroup({
  
    email: new FormControl('',[Validators.required, Validators.email])

  });

  

  constructor() { }

  ngOnInit() {
  }

}
