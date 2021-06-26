import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../../models/usuario.model';
import { UsuarioService } from '../../../services/usuario.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-usuario-editar',
  templateUrl: './usuario-editar.component.html',
  styles: []
})
export class UsuarioEditarComponent implements OnInit {

  formulario: FormGroup;
  usuario: Usuario

  constructor(
    private _usuarioService: UsuarioService,
    private _activatedRoute: ActivatedRoute,
    private shared: SharedService,
    private _router: Router
  ) {
    this.crearFormulario();
    this.usuario = new Usuario();
   }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe(({ruc}) => {
      this.obtener_usuario(ruc);
    });  
  }

  obtener_usuario(ruc: string) {
    this._usuarioService.listar_aprobar_usuario(0, ruc)
    .subscribe((resp: any) => {
      this.usuario = resp.data[0];
    });
  }

  crearFormulario(){
    this.formulario = new FormGroup({
        credito: new FormControl(null, [Validators.required]),
        tipo_credito: new FormControl(0, [Validators.required]),
        estado: new FormControl('2', [Validators.required])
    });
  }

  enviar_aprobacion() {
    
    this.usuario.credito = Number(this.formulario.value.credito);
    this.usuario.tipo_credito = Number(this.formulario.value.tipo_credito);
    this.usuario.estado = Number(this.formulario.value.estado);
    this._usuarioService.actualizar_aprobar_usuario(this.usuario)
    .subscribe((resp: any) => {
      console.log(resp);
      this.shared.alert_success('Enviado Satisfactoriamente');
    });

  }


}
