import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AdicionalesPage } from './adicionales';

@NgModule({
  declarations: [
    AdicionalesPage,
  ],
  imports: [
    IonicPageModule.forChild(AdicionalesPage),
  ],
})
export class AdicionalesPageModule {}
