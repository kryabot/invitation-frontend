import { OnInit, OnDestroy, Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DeviceDetectorService } from 'ngx-device-detector';
import { translationEn, translationRu } from '../translation.component';
import { InviteButton } from '../models/InviteButton';
import { DOCUMENT } from '@angular/common';
import { twitchAuthData } from '../configs.component';
import { BackendService } from '../data/backend.service';

@Component({
    selector: 'krya-verification',
    styleUrls: ['./verification.component.scss'],
    templateUrl: './verification.component.html',
})

export class VerificationComponent implements OnInit, OnDestroy {

    urlParams: Params;
    tgDisabled: boolean;
    telegram_url: string;
    frame_safe_url: SafeUrl;
    error_message: string;
    load_frame: boolean;
    device_info: any;
    waiting: boolean;
    haveParams: boolean;
    buttons: InviteButton[];
    channelName: string;
    apiResponse: any;

    twitch_user: any;

    footer_text = 'KryaBot';
    status_text = 'status';
    info_text = 'info_text';
    notice_text = ''
    telegram_base_url = 'tg://resolve?domain=KryaAuthBot&start=';
    telegram_official_url = 'https://t.me/KryaAuthBot?start=';
    telegram_alt_url = 'https://cflink.ru/KryaAuthBot?start=';

    constructor(private activatedRoute: ActivatedRoute,
                private sanitizer: DomSanitizer,
                private deviceService: DeviceDetectorService,
                private backend: BackendService,
                @Inject(DOCUMENT) private document: any) {
        this.waiting = true;
        //this.startLoading();


        this.activatedRoute.queryParams.subscribe((params: Params) => {
            this.urlParams = params;
          });

        this.activatedRoute.params.subscribe((params: Params) => {
            this.channelName = params.channelName;
            this.load();
        });


        this.load_frame = false;
        this.tgDisabled = false;
        this.error_message = '';
        this.device_info = this.deviceService.getDeviceInfo();
        this.telegram_url = '';
        this.buttons = [];

    }

    load(){

        this.backend.getTwitchData(this.channelName)
        .subscribe(response => {
            console.log(response)
            if (response && response._total > 0){
                this.twitch_user = response.users[0]
            }
            this.stopLoading()
        },
        error => {
            console.log(error)
            this.twitch_user = error;
            this.twitch_user.display_name = this.channelName;
            this.twitch_user.logo = 'https://static-cdn.jtvnw.net/user-default-pictures/27103734-3cda-44d6-a384-f2ab71e4bb85-profile_image-70x70.jpg';
            this.stopLoading()
        });

    }

    startLoading(){
        this.waiting = true;
        setTimeout(() =>
        {
            this.stopLoading();
        },
        1000);
    }

    inviteClick(btn: InviteButton){
        window.open(btn.url);
    }

    stopLoading(){
        this.waiting = false;
        this.checkParams();
    }
    ngOnInit(): void {

    }
    changeLoading(){
        this.waiting = !this.waiting;
    }
    checkParams(){
        if (this.urlParams.hash && this.urlParams.hash.length > 3){
            this.haveParams = true;
            this.status_text = this.getTranslation('header_success');
            this.callData();
        } else if(this.urlParams.error_description) {
            this.status_text = this.getTranslation('header_fail');
            this.info_text = this.getTranslation('login_fail');
            this.error_message = this.urlParams.error_description;
        } else {
            this.haveParams = false;
            this.status_text = this.getTranslation('header_welcome');
            this.info_text = this.getTranslation('welcome_info');
            //this.stopLoading();
        }
    }

    callData(){
        if (this.haveParams) {
            // iframe url
            this.telegram_url = this.telegram_base_url + this.urlParams.hash;
            this.info_text = this.getTranslation('success_info');
            this.buttons.push(this.createButton(this.getTranslation('button_direct'), this.telegram_base_url + this.urlParams.hash));
            this.buttons.push(this.createButton(this.getTranslation('button_official'), this.telegram_official_url + this.urlParams.hash));
            this.buttons.push(this.createButton(this.getTranslation('button_alt'), this.telegram_alt_url + this.urlParams.hash));
            this.generateFrame();
        }
    }

    ngOnDestroy(): void {

    }

    createButton(name: string, url: string): InviteButton{
        let btn = new InviteButton();
        btn.url = url;
        btn.name = name;
        return btn;
    }

    generateFrame(){
        this.load_frame = true;
        this.frame_safe_url = this.sanitizer.bypassSecurityTrustResourceUrl(this.telegram_url);
    }

    incorrectScheme(){
        console.log('tgDisabled');
        this.notice_text = this.getTranslation('twitch_notice');
        this.tgDisabled = true;

        // Process if not availble tg scheme
    }

    getTranslation(key: string): string{
        // if (this.urlParams.lang == 'ru'){
        //     return this.getTranslationRu(key);
        // }
        // return this.getTranslationEn(key);

        return this.getTranslationRu(key);
    }

    getTranslationEn(key: string): string{
        return translationEn.find(x => x.value == key).title;
    }


    getTranslationRu(key: string): string{
        return translationRu.find(x => x.value == key).title;
    }

    twitchAuth(){
        this.authorizeRedirect(twitchAuthData.clientId, twitchAuthData.redirect, twitchAuthData.scope);
    }

    protected authorizeRedirect(clientId: string, url: string, scopes: string) {
        // &redirect_uri=${url}

        const params = {
            response_type: 'code',
            client_id: clientId,
            redirect_uri: url,
            scope: scopes,
            state: this.channelName,

        }
        //let target = `https://id.twitch.tv/oauth2/authorize?${this.urlParameters(params)}`
        let target = `https://id.twitch.tv/oauth2/authorize?${this.urlEncodeParameters(params)}`

        this.document.location.href = target;
      }

    protected urlEncodeParameters(params: any): string {
    return Object.keys(params).map((k) => {
        return `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`;
    }).join('&');
    }

    protected urlParameters(params: any): string {
        return Object.keys(params).map((k) => {
            return `${k}=${params[k]}`;
        }).join('&');
        }
}
