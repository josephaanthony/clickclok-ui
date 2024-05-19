import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { OAuthService } from "angular-oauth2-oidc";
import { ContractService } from "./contract.service";

@Injectable({
    providedIn: 'root',
})
export class GameService {
    HTTP_OPTIONS = { withCredentials: false };

    constructor(private httpClient: HttpClient, private oauthService: OAuthService) {
        this.oauthService.configure({
            issuer: "https://accounts.google.com",
            strictDiscoveryDocumentValidation: false,
            clientId: "277006726082-fp7gnbsf2pv4pcih78kjf9on9sdss8fp.apps.googleusercontent.com",
            redirectUri: window.location.origin,
            scope: "openid profile email"
        });

        this.oauthService.setupAutomaticSilentRefresh();
        this.oauthService.loadDiscoveryDocumentAndTryLogin();
    }

    login() : any {
        let claims = this.oauthService.getIdentityClaims();
        if(claims == null) {
            this.oauthService.initImplicitFlow();
        }
        console.log("Claims: " + claims);

        return claims;
    }

    async registerUser(name: string, senderAddress: string, walletType: ContractService.WALLET_TYPE) {
        return await lastValueFrom(this.httpClient.post(environment.app.baseUrl + "/cc-api/registerUser", {
            "clikClokName": name,
            "senderAddress": senderAddress,
            "walletType": walletType,
        }, this.HTTP_OPTIONS));
    }

    async getContractUpdates(name: string, senderAddress: string, walletType: ContractService.WALLET_TYPE) {
        return await lastValueFrom(this.httpClient.get(environment.app.baseUrl + "/cc-api/clickcloks?name=" + name + "&walletType=" + walletType + "&senderAddress=" + senderAddress,
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