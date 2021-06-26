import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styles: [
  ]
})
export class UsuarioComponent implements OnInit {

  pagina_actual: number = 1;  
  usuarios: Usuario[];

  form_busqueda: FormGroup;

  constructor(
    private _usuarioService: UsuarioService,
    private _router: Router
  ) { 
    this.crear_formulario();
    this.usuarios = [];
  }

  ngOnInit(): void {
    this.listar_usuario();
  }

  crear_formulario() {
    this.form_busqueda = new FormGroup({
      estado: new FormControl(1, [Validators.required]),
      patron_busqueda: new FormControl('')
    });
  }

  editar_usuario(usuario: Usuario) {
    this._router.navigate(['/mantenimiento/usuario/' + usuario.ruc ]);
  }

  listar_usuario() {
    const estado = Number(this.form_busqueda.value.estado);
    const patron_busqueda = this.form_busqueda.value.patron_busqueda;
    this._usuarioService.listar_aprobar_usuario(estado, patron_busqueda)
    .subscribe((resp: any) => {
      this.usuarios = resp.data;
    });
  }

  obtener_estado(estado: number) {
    switch (estado) {
      case 1:
        return 'Pendiente'
        break;
      case 2:
        return 'Aprobado'
        break;
      default:
        return 'Rechazado'
        break;
    }
  }

  

}
