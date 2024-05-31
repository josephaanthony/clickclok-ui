import { Injectable } from "@angular/core";
import { AlertController, AlertOptions } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    private supportEmailAddress = "joseph.anthony@gmail.com";

    constructor(private alertController: AlertController) {
    }

    async showAlert(alertOptions: AlertOptions) {
        const alert = await this.alertController.create(alertOptions);
        await alert.present();
    }

}
