import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FavoritasPage } from './favoritas';

@NgModule({
  declarations: [
    FavoritasPage,
  ],
  imports: [
    IonicPageModule.forChild(FavoritasPage),
  ],
})
export class FavoritasPageModule {}
