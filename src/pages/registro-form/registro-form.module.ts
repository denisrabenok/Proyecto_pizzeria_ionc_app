import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegistroFormPage } from './registro-form';

@NgModule({
  declarations: [
    RegistroFormPage,
  ],
  imports: [
    IonicPageModule.forChild(RegistroFormPage),
  ],
})
export class RegistroFormPageModule {}
