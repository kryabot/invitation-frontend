import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, retry } from 'rxjs/operators';

@Injectable()
export class BackendService {
    private base_url: string;

    constructor(private http: HttpClient){
        this.base_url = 'https://api.krya.dev';
    }

    protected getHeader(auth?: boolean): HttpHeaders{
        let head = new HttpHeaders();
        head.set("Content-Type", "application/json");
        return head;
    }

    getTwitchData(name: string): Observable<any>{
        const headers = new HttpHeaders()
        .set("Accept", "application/vnd.twitchtv.v5+json")
        .append("Client-ID", "ymxy9wvidt7jx1qyzxmvnzadgs24pp");
        
        return this.http.get(`https://api.twitch.tv/kraken/users?login=${name}`, {headers})
        .pipe(
            retry(3),
          );
    }

    getVerificationData(code: string, channel: string): Observable<any>{
        return this.http.get(`${this.base_url}/login/telegram?code=${code}&channel=${channel}`, {headers: this.getHeader()})
        .pipe(
            retry(2),
          );
    }

}
