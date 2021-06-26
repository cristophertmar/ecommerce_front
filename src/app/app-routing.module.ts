import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ShopComponent } from './pages/shop/shop.component';
import { ShopSingleComponent } from './pages/shop-single/shop-single.component';
import { AccountComponent } from './pages/account/account.component';
import { CategoriaComponent } from './management/categoria/categoria.component';
import { SubCategoriaComponent } from './management/sub-categoria/sub-categoria.component';
import { MarcaComponent } from './management/marca/marca.component';
import { ProductoComponent } from './management/producto/producto.component';
import { UsuarioComponent } from './management/usuario/usuario.component';
import { ProductoEditarComponent } from './management/producto/producto-editar/producto-editar.component';
import { TipoComponent } from './management/tipo/tipo.component';
import { PromocionComponent } from './management/promocion/promocion.component';
import { UsuarioEditarComponent } from './management/usuario/usuario-editar/usuario-editar.component';
import { SeguimientoPedidoComponent } from './management/seguimiento-pedido/seguimiento-pedido.component';
import { SeguimientoEditarComponent } from './management/seguimiento-pedido/seguimiento-editar/seguimiento-editar.component';

// Guards
import { AccountGuard } from './guards/account.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: 'inicio', component: HomeComponent },
  { path: 'nosotros', component: AboutComponent },
  { path: 'carrito-compras', component: CartComponent },
  { path: 'realizar-pago', component: CheckoutComponent, canActivate: [AccountGuard] },
  { path: 'contactanos', component: ContactComponent },
  { path: 'mi-perfil', component: ProfileComponent, canActivate: [AccountGuard] },
  { path: 'productos', component: ShopComponent },
  { path: 'producto-detalle/:token', component: ShopSingleComponent },
  { path: 'inicia-ahora', component: AccountComponent },

  { path: 'mantenimiento/categoria', component: CategoriaComponent, canActivate: [AccountGuard, AdminGuard] },
  { path: 'mantenimiento/sub-categoria', component: SubCategoriaComponent, canActivate: [AccountGuard, AdminGuard] },
  { path: 'mantenimiento/tipo', component: TipoComponent, canActivate: [AccountGuard, AdminGuard] },
  { path: 'mantenimiento/marca', component: MarcaComponent, canActivate: [AccountGuard, AdminGuard] },
  { path: 'mantenimiento/promocion', component: PromocionComponent, canActivate: [AccountGuard, AdminGuard] },
  { path: 'mantenimiento/producto', component: ProductoComponent, canActivate: [AccountGuard, AdminGuard] },
  { path: 'mantenimiento/usuario', component: UsuarioComponent, canActivate: [AccountGuard, AdminGuard] },
  { path: 'mantenimiento/seguimiento-pedido', component: SeguimientoPedidoComponent, canActivate: [AccountGuard, AdminGuard] },

  { path: 'mantenimiento/producto/:codigo', component: ProductoEditarComponent, canActivate: [AccountGuard, AdminGuard] },
  { path: 'mantenimiento/usuario/:ruc', component: UsuarioEditarComponent, canActivate: [AccountGuard, AdminGuard] },
  { path: 'mantenimiento/seguimiento-pedido/:token', component: SeguimientoEditarComponent, canActivate: [AccountGuard, AdminGuard] },


  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: '**', pathMatch: 'full', redirectTo: '/inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule {  }
