import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonFooter, IonGrid, IonCol, IonRow, IonText, IonIcon, 
  IonFab, IonFabButton, IonFabList, IonLabel, IonSelect, IonList, IonItem, IonItemOption, IonSelectOption, IonMenu, IonButtons, IonMenuButton,
  MenuController } from '@ionic/angular/standalone';
import { refreshCircle, chevronDownCircle, logInOutline, logOutOutline, personCircleOutline } from 'ionicons/icons';
import { BouncingBallComponent } from '../bouncing-ball/bouncing-ball.component';
import { BouncingBallSimpleComponent } from '../bouncing-ball-simple/bouncing-ball-simple.component';
import { GameAreaComponent } from '../game/game-area.component';
import { ContractService } from '../service/contract.service';
import { loadScript } from "@paypal/paypal-js";
import { Observable, Subscription, catchError, concatMap, delay, finalize, interval, repeat, repeatWhen, switchMap, take, timer } from 'rxjs';
import { addIcons } from 'ionicons';
import { GameCircleComponent } from "../game-circle/game-circle.component";
import { AlertService } from '../service/alert.service';

declare function initPaypal(): any;

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    standalone: true,
    imports: [IonMenuButton, IonButtons, IonIcon, IonText, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonFooter, IonGrid, IonCol, IonRow,
        IonList, IonSelect, IonSelectOption, IonItem, IonLabel, IonItemOption, IonFab, IonFabButton, IonFabList, IonMenu,
        CommonModule, BouncingBallComponent, BouncingBallSimpleComponent, GameAreaComponent, GameCircleComponent]
})
export class HomePage implements OnInit, OnDestroy {
  COUNT_RESET_VALUE = 300;
  prizeMoney = 0;
  countdown: number = this.COUNT_RESET_VALUE;
  senderAddress: any;
  // lastPrizeMoneyUpdate = new Date().getTime();
  walletConnected = false;
  contractUpdateInterval: any;
  userWalletBalance = 0;
  tokenDataInitialized: boolean = false;
  tokenValue = 1;
  statusSubscription: Subscription | undefined;

  @ViewChild('payPalOpenButton') payPalOpenButton: IonFab | undefined;

  constructor(private contractService: ContractService, private menuCtrl: MenuController, private alertService: AlertService) {  
    addIcons({refreshCircle});  
    addIcons({chevronDownCircle});  
    addIcons({logInOutline}); 
    addIcons({logOutOutline});
    addIcons({personCircleOutline}) 
  }

  ngOnInit() {
    this.loadPaypalScript();
    this.contractService.initializeAuth().then(resp => {
      this.walletConnected = resp ? true: false;
      this.senderAddress = resp;
    });

    // this.getContractUpdates();
    // initPaypal();
  }

  openMetaMask(walletType: ContractService.WALLET_TYPE) {
    this.contractService.openWallet(walletType).then(resp =>{
      this.walletConnected = resp ? true: false;
      this.senderAddress = resp;
    })
  }

  async loadPaypalScript() {
    let paypal: any;

    try {
        paypal = await loadScript({ clientId: "AUsmsmTQpWACUHNPRvhQuQkgfKVB-qSkOIRJoPB5oarQHnzqXcEGY8nfohUOjFedyZAnq30wsPafNiw9",
          enableFunding: "venmo", currency: "USD", disableFunding: "paylater"
        });
        
        // paypal.Buttons().render('#paypal-button-container');

        var self = this;

        paypal.Buttons({
          onApprove(data: any) {
            self.contractService.confirmPayment(data).pipe(
              finalize(() => {
                self.payPalOpenButton?.close();
              })
            ).subscribe((resp: any): void => {
              this.countdown = this.calculateTimestampDifference(resp["currentTimestamp"],  resp["lastExecutedTimestamp"]);
              this.prizeMoney = resp["potEquity"];
              this.userWalletBalance = resp["userWalletBalance"];
              this.tokenValue = resp["gameStakeValue"];
            })
          },
          onError(err: any) {
            // For example, redirect to a specific error page
            self.alertService.showAlert({
              header: 'Payment Error',
              message: 'Error processing payment. Please contact support.',
              buttons: ['OK'],
            })
          }
          
        }).render('#paypal-button-container');
    } catch (error) {
        console.error("failed to load the PayPal JS SDK script", error);
    }
  }

  ngOnDestroy() {
  }

  isCryptoWalletAvailable() {
    return this.contractService.isCryptoWalletAvailable;
  }

  handleWalletChange(e: any) {
    // this.openMetaMask(e.detail.value);
    this.openMetaMask(ContractService.WALLET_TYPE.GOOGLE);
  }

  getContractUpdates() {
    this.contractUpdateInterval = setInterval(() => {
      this.getTokenData();
    }, 1000)
  }

  getTokenData() : void {
    if(this.tokenDataInitialized) {
      return;
    }

    this.tokenDataInitialized = true;

    this.statusSubscription = this.contractService.getContractUpdateOb().pipe(
      delay(3000), 
      take(1),
      repeat(),
      catchError((err: any, caught: Observable<Object>) => {
        this.tokenDataInitialized = false; 
        console.log("Status check failed " + err?.message);
        return caught;
      })
      // takeUntilDestroyed(this.destroyRef)
    ).subscribe((resp: any): void => {
      this.countdown = this.calculateTimestampDifference(resp["currentTimestamp"],  resp["lastExecutedTimestamp"]);
      this.prizeMoney = resp["potEquity"];
      this.userWalletBalance = resp["userWalletBalance"];
      this.tokenValue = resp["gameStakeValue"];
      
      this.tokenDataInitialized = true;
      // return this.getTokenData();
    });
  }

  public endStatusSubscription() {
    this.statusSubscription?.unsubscribe();
    this.tokenDataInitialized = false;
  }


  private calculateTimestampDifference(timestamp1: number, timestamp2: number): number {
    // Convert both timestamps to milliseconds
    const timestamp1Millis = timestamp1 * 1000;
    const timestamp2Millis = timestamp2 * 1000;

    // Calculate the difference in milliseconds
    const differenceMillis = Math.abs(timestamp1Millis - timestamp2Millis);

    // Convert the difference back to seconds
    const differenceSeconds = Math.floor(differenceMillis / 1000);

    return differenceSeconds;
  }

  getAirDrop() {
    this.contractService.getAirDrop().then(() => {
      console.log("Air Drop done");
    })
  }

  logOut() {
    this.contractService.logOutWallet().then(() => {
      this.senderAddress = null;
      this.menuCtrl.close();
    });
  }

  incrementPrizeMoney() {
    // this.prizeMoney += 50;
    // this.lastPrizeMoneyUpdate = new Date().getTime();
    // this.resetCountdown();

    this.contractService.sendTransaction(this.tokenValue);
  }

  formatCountdown() {
    const minutes = Math.floor(this.countdown / 60);
    const seconds = this.countdown % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  resetCountdown() {
    this.countdown = this.COUNT_RESET_VALUE;
  }
}
