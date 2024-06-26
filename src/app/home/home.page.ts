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
import { Observable, Subscription, catchError, concatMap, delay, finalize, firstValueFrom, interval, repeat, repeatWhen, switchMap, take, timer } from 'rxjs';
import { addIcons } from 'ionicons';
import { GameCircleComponent } from "../game-circle/game-circle.component";
import { AlertService } from '../service/alert.service';
// import moment from 'moment';

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
  COUNT_RESET_VALUE = 0;
  prizeMoney = 0;
  countdown: number = this.COUNT_RESET_VALUE;
  gameDurationInSeconds: number = this.COUNT_RESET_VALUE;
  senderAddress: any;
  leaderBoardList = [];
  // lastPrizeMoneyUpdate = new Date().getTime();
  walletConnected = false;
  contractUpdateInterval: any;
  userWalletBalance = 0;
  userWalletTokenBalance = 0;
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

      if(this.senderAddress) {
        this.getOneTimeUpdate();
      }
    });
  }

  openMetaMask(walletType: ContractService.WALLET_TYPE) {
    this.contractService.openWallet(walletType).then(resp =>{
      this.walletConnected = resp ? true: false;
      this.senderAddress = resp;

      if(this.senderAddress) {
        this.getOneTimeUpdate();
      }
    })
  }

  getOneTimeUpdate() {
    this.contractService.getContractUpdateOb().pipe(
      catchError((err: any, caught: Observable<Object>) => {
        this.tokenDataInitialized = false; 
        console.log("Status check failed " + err?.message);
        return caught;
      })
    ).subscribe((resp: any): void => {
      HomePage.updateSelfProperties(this, resp);
    });
  }

  static updateSelfProperties(self: HomePage, resp: any) {
    console.log("Old Countdown value: " + self.countdown);

    // let currentTimestamp = moment().unix();
    // let lastExecutedTimestamp = moment(resp.lastExecutedTimestamp).unix();
    // self.countdown = self.calculateTimestampDifference(currentTimestamp,  lastExecutedTimestamp);

    self.countdown = (new Date().getTime() - new Date(resp.lastExecutedTimestamp).getTime()) / 1000; // in seconds

    self.gameDurationInSeconds = resp["gameDurationInSeconds"];
    self.prizeMoney = resp["potEquity"];
    self.userWalletBalance = resp["userWalletBalance"];
    self.userWalletTokenBalance = resp["userWalletTokenBalance"];
    self.tokenValue = resp["gameStakeValue"];

    self.leaderBoardList = resp["leaderBoard"]?.map((el: string) => {
      let arr = el.split('##$##');
      return [ arr[0], arr[1]];
      // (new Date().getTime() - new Date(arr[1]).getTime()) / 1000];
    });

    console.log("New Countdown value: " + self.countdown);
  }

  reduceBy30Percent(initialValue: number, iterations: number): string {
    return initialValue * Math.pow(0.7, iterations) + "%";
  }

  formatTime(lastExecutedTimestamp: any): string {
    let secondsSpent = (new Date().getTime() - new Date(lastExecutedTimestamp).getTime()) / 1000;

    // const hours = Math.floor(secondsLeft/ 3600);
    // const minutes = Math.floor(secondsLeft / 60);
    // const remainingSeconds = Math.floor(secondsLeft % 60);

    // const days = Math.floor(secondsSpent / (3600 * 24));
    // secondsSpent %= 3600 * 24;
    const hours = Math.floor(secondsSpent / 3600);
    secondsSpent %= 3600;
    const minutes = Math.floor(secondsSpent / 60);
    const remainingSeconds = Math.floor(secondsSpent % 60);

    // return `${this.pad(days)}:${this.pad(hours)}:${this.pad(minutes)}:${this.pad(remainingSeconds)}`;  
    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(remainingSeconds)}`;  
}

  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  async loadPaypalScript() {
    let paypal: any;

    try {
        paypal = await loadScript({ clientId: "AUsmsmTQpWACUHNPRvhQuQkgfKVB-qSkOIRJoPB5oarQHnzqXcEGY8nfohUOjFedyZAnq30wsPafNiw9",
          enableFunding: "venmo", currency: "USD", components: "buttons"
        });
        
        // paypal.Buttons().render('#paypal-button-container');

        var self = this;

        paypal.Buttons({        
          style: {
            shape: "rect",
            layout: "vertical",
            color: "gold",
            label: "paypal",
          },
          async createOrder(data: any, actions: any) {
            data.amount = {
              value: "1",
              currencyCode: "USD"
            }
            let resp: any = await firstValueFrom(self.contractService.createPaymentOrder(data)).finally(() => 
              self.payPalOpenButton?.close()
            );
            return resp.orderID;
          },
          async onApprove(data: any) {
            let resp = await firstValueFrom(self.contractService.confirmPayment(data)).finally(() => self.payPalOpenButton?.close())
            HomePage.updateSelfProperties(self, resp);
            // .subscribe((resp: any): void => {
            //   HomePage.updateSelfProperties(self, resp);
            // })

            // self.contractService.confirmPayment(data).pipe(
            //   finalize(() => {
            //     self.payPalOpenButton?.close();
            //   })
            // ).subscribe((resp: any): void => {
            //   HomePage.updateSelfProperties(self, resp);
            // })
          },
          onError(err: any) {
            self.payPalOpenButton?.close();
            // For example, redirect to a specific error page
            self.alertService.showAlert({
              header: 'Payment Error',
              message: 'Error processing payment. Please contact support.',
              buttons: ['OK'],
            })
          },
          onShippingChange(data: any, actions: any) {
            return true;
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

    this.statusSubscription = this.contractService.getContractUpdateOb()
    .pipe(
      repeat({ delay: 8000 }),
      catchError((err: any, caught: Observable<Object>) => {
        this.tokenDataInitialized = false; 
        console.log("Status check failed " + err?.message);
        return caught;
      })
    ).subscribe((resp: any): void => {
      HomePage.updateSelfProperties(this, resp);
      this.tokenDataInitialized = true;
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
    this.contractService.sendTransaction(this.tokenValue).subscribe((resp: any): void => {      
      HomePage.updateSelfProperties(this, resp);
      console.log("Updated Self Properties");
    });
  }

  formatCountdown() {
    const minutes = Math.floor(this.countdown / 60);
    const seconds = this.countdown % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  resetCountdown() {
    this.countdown = this.COUNT_RESET_VALUE;
  }

  ngDestroy() {
    this.endStatusSubscription();
  }
}
