import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ValoresPage } from './valores';

@NgModule({
  declarations: [
    ValoresPage,
  ],
  imports: [
    IonicPageModule.forChild(ValoresPage),
  ],
})
export class ValoresPageModule {}
