import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { environment } from '../../environments/environment';
import { Observable, lastValueFrom, map, switchMap, timer } from 'rxjs';
import { Authentication, GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { ContractService } from "./contract.service";
import { RxStompService } from "./rx-stomp.service";
import moment from "moment";

@Injectable({
    providedIn: 'root',
})
export class GameService {
    HTTP_OPTIONS = { withCredentials: false };

    CLIENT_ID = '277006726082-fp7gnbsf2pv4pcih78kjf9on9sdss8fp.apps.googleusercontent.com';
    WEB_API_KEY = 'AIzaSyDz1Uauhj8sFaLs8GunpPJ1hvn7d9XFTVM';


    constructor(private httpClient: HttpClient, private rxStompService: RxStompService) {
    }

    async initializeAuth(): Promise<any> {
        return await GoogleAuth.initialize({
            clientId: this.CLIENT_ID,
            scopes: ['profile', 'email'],
            grantOfflineAccess: true,
        }).then(() => {
            return GoogleAuth.refresh()
                .then((data: Authentication) => {
                    if (data.accessToken) {
                        let userData = this.getUserProfileData(data.accessToken);
                        return userData;
                    } else {
                        return null;
                    }
                })
        }).catch(err => {
            console.log(err);
        });
    }

    async getUserProfileData(token: string) {
        const options = {
          url: `https://www.googleapis.com/oauth2/v2/userinfo?key=` + this.WEB_API_KEY + `&oauth_token=${token}`,
          headers:{'Content-Type': 'application/json'}
        };
        // const response = await this.httpClient.get({ ...options, method: 'GET' });
        const response = await lastValueFrom(this.httpClient.get(options.url));
        return response;
    }

    async login() {
        return await GoogleAuth.signIn().catch((reason: any) => {
            console.log("Error signing in 1" + reason);
            console.log("Error signing in 2" + JSON.stringify(reason));
            throw new Error("Error signing in " + reason);
        });
    }

    async logOut() {
        return GoogleAuth.signOut().catch((reason: any) => {
            console.log("Error signing in 1" + reason);
            console.log("Error signing in 2" + JSON.stringify(reason));
            throw new Error("Error signing in " + reason);
        });
    }

    async confirmPayment(name: string, senderAddress: string, paymentData: any) {
        paymentData.clikClokName = name;
        paymentData.senderAddress = senderAddress;

        return await lastValueFrom(this.httpClient.post(environment.app.baseUrl + "/cc-api/confirmPayment", paymentData, this.HTTP_OPTIONS));
    }

    async getAirDrop(name: string, senderAddress: string) {
        return await lastValueFrom(this.httpClient.get(environment.app.baseUrl + "/cc-api/airDrop?name=" + name + "&senderAddress=" + senderAddress,
            this.HTTP_OPTIONS));
    }

    async registerUser(name: string, senderAddress: string, walletType: ContractService.WALLET_TYPE) {
        return await lastValueFrom(this.httpClient.post(environment.app.baseUrl + "/cc-api/registerUser", {
            "clikClokName": name,
            "senderAddress": senderAddress,
            "walletType": walletType,
        }, this.HTTP_OPTIONS));
    }

    async getContractUpdates(name: string, senderAddress: string, walletType: ContractService.WALLET_TYPE) {
        // return timer(500).pipe(
        //     switchMap(()=>
        //         this.httpClient.get(environment.app.baseUrl + "/cc-api/clikcloks?name=" + name + "&walletType=" + walletType + "&senderAddress=" + senderAddress,
        //         this.HTTP_OPTIONS).pipe(
        //             map( (result: any) => { 
        //                 console.log(result);

                        
        //                 // result = {
        //                 //     ... result,
        //                 //     currentTimestamp: moment().unix(),
        //                 //     lastExecutedTimestamp: moment(result.lastExecutedTimestamp).unix()
        //                 // }

        //                 return result;
        //             })
        //         )
        //     )
        // );

        // return await lastValueFrom(this.httpClient.get(environment.app.baseUrl + "/cc-api/clikcloks?name=" + name + "&walletType=" + walletType + "&senderAddress=" + senderAddress,
        //     this.HTTP_OPTIONS));


        // this.rxStompService.watch('/topic/gameMessage').subscribe((message: any) => {
        //     console.log("Received Message: " + message);
        //     // this.receivedMessages.push(message.body);
        // });

        return await lastValueFrom(this.httpClient.get(environment.app.baseUrl + "/cc-api/clikclokviews?name=" + name + "&senderAddress=" + senderAddress,
        this.HTTP_OPTIONS));



    }

    getContractUpdatesOb(name: string, senderAddress: string, walletType: ContractService.WALLET_TYPE): Observable<Object> { 
        return this.httpClient.get(environment.app.baseUrl + "/cc-api/clikclokviews?name=" + name + "&senderAddress=" + senderAddress,
        this.HTTP_OPTIONS);
    }

    async stake(name: string, walletType: ContractService.WALLET_TYPE, senderAddress: string, value: number) {
        return await lastValueFrom(this.httpClient.post(environment.app.baseUrl + "/cc-api/stakes", {
            "clikClokName": name,
            "senderAddress": senderAddress,
            "walletType": walletType,
            "value": value
        }, this.HTTP_OPTIONS));
    }
}