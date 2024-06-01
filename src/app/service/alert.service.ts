import { Injectable } from "@angular/core";
import { AlertController, AlertOptions, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    private supportEmailAddress = "joseph.anthony@gmail.com";

    constructor(private alertController: AlertController, 
        private toastController: ToastController) {
    }

    async showAlert(alertOptions: AlertOptions) {
        const alert = await this.alertController.create(alertOptions);
        await alert.present();
    }

    async showToast(toastOptions: ToastOptions) {
        const alert = await this.toastController.create(toastOptions);
        await alert.present();
    }

}
