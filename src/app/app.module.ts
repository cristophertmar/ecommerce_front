import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NgxPaginationModule} from 'ngx-pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { CartComponent } from './pages/cart/cart.component';
import { ShopComponent } from './pages/shop/shop.component';
import { ShopSingleComponent } from './pages/shop-single/shop-single.component';
import { AccountComponent } from './pages/account/account.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CategoriaComponent } from './management/categoria/categoria.component';
import { SubCategoriaComponent } from './management/sub-categoria/sub-categoria.component';
import { MarcaComponent } from './management/marca/marca.component';
import { ProductoComponent } from './management/producto/producto.component';
import { UsuarioComponent } from './management/usuario/usuario.component';
import { ProductoEditarComponent } from './management/producto/producto-editar/producto-editar.component';
import { TipoComponent } from './management/tipo/tipo.component';
import { PromocionComponent } from './management/promocion/promocion.component';
import { UsuarioEditarComponent } from './management/usuario/usuario-editar/usuario-editar.component';

import { registerLocaleData } from '@angular/common';
import localesPE from '@angular/common/locales/es-PE';
import { SeguimientoPedidoComponent } from './management/seguimiento-pedido/seguimiento-pedido.component';
import { SeguimientoEditarComponent } from './management/seguimiento-pedido/seguimiento-editar/seguimiento-editar.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
registerLocaleData(localesPE, 'es-Pe');

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    CheckoutComponent,
    CartComponent,
    ShopComponent,
    ShopSingleComponent,
    AccountComponent,
    ContactComponent,
    AboutComponent,
    ProfileComponent,
    CategoriaComponent,
    SubCategoriaComponent,
    MarcaComponent,
    ProductoComponent,
    UsuarioComponent,
    ProductoEditarComponent,
    TipoComponent,
    PromocionComponent,
    UsuarioEditarComponent,
    SeguimientoPedidoComponent,
    SeguimientoEditarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    SocialLoginModule,
    InfiniteScrollModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-Pe' },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider('112121065768-cn1bsvsclcq1rlvk0fuvc4q36u7dcpp6.apps.googleusercontent.com')
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('569967727213576')
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
