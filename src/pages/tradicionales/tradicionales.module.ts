import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TradicionalesPage } from './tradicionales';

@NgModule({
  declarations: [
    TradicionalesPage,
  ],
  imports: [
    IonicPageModule.forChild(TradicionalesPage),
  ],
})
export class TradicionalesPageModule {}
