import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistroSocialPage } from './registro-social';

@NgModule({
  declarations: [
    RegistroSocialPage,
  ],
  imports: [
    IonicPageModule.forChild(RegistroSocialPage),
  ],
})
export class RegistroSocialPageModule {}
