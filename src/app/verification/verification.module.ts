import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { VerificationComponent } from './verification.component';
import { BackendService } from '../data/backend.service';
import { HttpClient } from '@angular/common/http';
import { SpinnerModule } from '../components/spinner/spinner.module';



@NgModule({
    imports: [    
        CommonModule,
        FormsModule,
        RouterModule,
        SpinnerModule,
        ],
        declarations: [
            VerificationComponent,
          ],
          providers: [BackendService, HttpClient
          ],
        })
export class VerificationModule {

}