import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerificationComponent } from './verification/verification.component';
import { TwitchAuthCallbackComponent } from './callback/callback.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [{
  path: '',
  children: [
    {
      path: '',
      component: HomeComponent,
    },
    {
      path: 'twitch',
      component: TwitchAuthCallbackComponent,
    },
    {
      path: ':channelName',
      children: [
        {
          path: '',
          component: VerificationComponent,
        },
      ],
    },
    {
      path: '**', redirectTo: '',
    },

  ],
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
