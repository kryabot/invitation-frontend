import { SpinnerComponent } from './spinner.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [    
        CommonModule,
    ],
    exports: [
        SpinnerComponent
    ],
    declarations: [
        SpinnerComponent,
    ],
})

export class SpinnerModule {

}