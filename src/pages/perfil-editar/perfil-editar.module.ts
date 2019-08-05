import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PerfilEditarPage } from './perfil-editar';

@NgModule({
  declarations: [
    PerfilEditarPage,
  ],
  imports: [
    IonicPageModule.forChild(PerfilEditarPage),
  ],
})
export class PerfilEditarPageModule {}
