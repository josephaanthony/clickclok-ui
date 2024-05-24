import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { ContractService } from "./contract.service";

@Injectable({
    providedIn: 'root',
})
export class GameService {
    HTTP_OPTIONS = { withCredentials: false };

    constructor(private httpClient: HttpClient) {
        // this.oauthService.configure({
        //     issuer: "https://accounts.google.com",
        //     strictDiscoveryDocumentValidation: false,
        //     clientId: "277006726082-fp7gnbsf2pv4pcih78kjf9on9sdss8fp.apps.googleusercontent.com",
        //     redirectUri: window.location.origin,
        //     scope: "openid profile email"
        // });

        GoogleAuth.initialize({
            clientId: '277006726082-fp7gnbsf2pv4pcih78kjf9on9sdss8fp.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
            grantOfflineAccess: true,
        });

        // this.oauthService.setupAutomaticSilentRefresh();
        // this.oauthService.loadDiscoveryDocumentAndTryLogin();
    }

    async login() {
        return await GoogleAuth.signIn();

        // let claims = this.oauthService.getIdentityClaims();
        // if(claims == null) {
        //     this.oauthService.initImplicitFlow();
        // }
        // console.log("Claims: " + googleUser);

        // return googleUser;
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
        return await lastValueFrom(this.httpClient.get(environment.app.baseUrl + "/cc-api/clikcloks?name=" + name + "&walletType=" + walletType + "&senderAddress=" + senderAddress,
            this.HTTP_OPTIONS));
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