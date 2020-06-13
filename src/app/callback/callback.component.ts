import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BackendService } from '../data/backend.service';
import { twitchAuthData } from '../configs.component';
import { translationRu } from '../translation.component';

@Component({
    selector: 'krya-auth-callback',
    template: '<krya-spinner *ngIf="waiting"></krya-spinner>'
})

export class TwitchAuthCallbackComponent implements OnInit, OnDestroy {
    urlParams: Params;
    waiting: boolean;
    constructor(private activatedRoute: ActivatedRoute,
                private backend: BackendService,
                private router: Router){
        this.waiting = true;
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            if(!params.code && params.state) {
                this.router.navigate([`/${params.state}`], {queryParams: params});
                return;
            }
            if(!params.state) {
                
                this.router.navigate([''], {queryParams: params});
                return;
            }
            
            this.urlParams = params;
            
            this.backend.getVerificationData(params.code, params.state)
                .subscribe((response) => {
                    if(response == null){
                        this.router.navigate([`/${params.state}`], {queryParams: {'error_description': 'Failed to receive data, please try again later.'}});
                        return
                    }
                    if(response.message){
                        this.router.navigate([`/${params.state}`], {queryParams: {'error_description': response.message}});
                        return;
                    } else if(response.error){
                        this.router.navigate([`/${params.state}`], {queryParams: {'error_description': this.getTranslationRu(response.error)+` (${params.state})`}});
                        return;
                    } else if(response.scope[0] != twitchAuthData.scope){
                        this.router.navigate([`/${params.state}`], {queryParams: {'error_description': 'Required scope was not granted'}});
                        return;
                    }
                    this.router.navigate([`/${params.state}`], {queryParams: {'hash': response.invite}});
                },
                err => {
                    console.log(err)
                    this.router.navigate([`/${params.state}`], {queryParams: {'error_description': 'Server error, please retry'}});
                });
            
            
          });

    }
    ngOnInit(): void {

    }    
    ngOnDestroy(): void {

    }

    getTranslationRu(key: string): string{
        return translationRu.find(x => x.value == key).title;
    }
}