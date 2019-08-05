import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComboPage } from './combo';


@NgModule({
  declarations: [
    ComboPage,
  ],
  imports: [
    IonicPageModule.forChild(ComboPage),
  ],
})
export class ComboPageModule {}
