import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../../models/usuario.model';
import { UsuarioService } from '../../../services/usuario.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedService } from '../../../services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';

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
    private _router: Router,
    private _spinner: NgxSpinnerService
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
      console.log(this.usuario);
    });
  }

  crearFormulario(){
    this.formulario = new FormGroup({
        credito: new FormControl(null, [Validators.required]),
        tipo_credito: new FormControl(0, [Validators.required, Validators.pattern('^(?!0).*$')]),
        estado: new FormControl('2', [Validators.required])
    });
  }

  enviar_aprobacion() {    

    if(this.pasar_validacion()) {
  
      this.usuario.credito = Number(this.formulario.value.credito);
      this.usuario.tipo_credito = Number(this.formulario.value.tipo_credito);
      this.usuario.estado = Number(this.formulario.value.estado);
      /* console.log(this.usuario); */
      this._spinner.show();
      this._usuarioService.actualizar_aprobar_usuario(this.usuario)
      .subscribe((resp: any) => {
        this._spinner.hide();
        this.shared.alert_success('Enviado Satisfactoriamente');
        this.retornar_lista();
      },
      (error) => {
        this._spinner.hide();
      }
      
      );
    } 

  }

  pasar_validacion(): boolean {
    if(this.formulario.invalid){
      Object.values( this.formulario.controls).forEach( control => {
        control.markAsTouched();
      });
      return false;
    }
    return true;
  }

  get creditoNoValido() {
    return this.formulario.get('credito').invalid && this.formulario.get('credito').touched;
  }

  get tipo_creditoValido() {
    return this.formulario.get('tipo_credito').invalid && this.formulario.get('tipo_credito').touched;
  }


  retornar_lista() {
    this._router.navigate(['/mantenimiento/usuario']);
  }



}
