import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonFooter, IonGrid, IonCol, IonRow, IonText, IonIcon, IonSelect, IonList, IonItem, IonItemOption, IonSelectOption } from '@ionic/angular/standalone';
import { BouncingBallComponent } from '../bouncing-ball/bouncing-ball.component';
import { BouncingBallSimpleComponent } from '../bouncing-ball-simple/bouncing-ball-simple.component';
import { GameAreaComponent } from '../game/game-area.component';
import { ContractService } from '../service/contract.service';
import { loadScript } from "@paypal/paypal-js";
import { Observable, concatMap, delay, interval, repeat, repeatWhen, switchMap, take, timer } from 'rxjs';

declare function initPaypal(): any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonIcon, IonText, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonFooter, IonGrid, IonCol, IonRow,
    IonList, IonSelect, IonSelectOption, IonItem, IonItemOption,
    CommonModule, BouncingBallComponent, BouncingBallSimpleComponent, GameAreaComponent],
})
export class HomePage implements OnInit, OnDestroy {
  COUNT_RESET_VALUE = 300;
  prizeMoney = 0;
  countdown: number = this.COUNT_RESET_VALUE;
  senderAddress: string = "";
  // lastPrizeMoneyUpdate = new Date().getTime();
  walletConnected = false;
  contractUpdateInterval: any;
  userWalletBalance = 0;

  constructor(private contractService: ContractService) {    
  }

  ngOnInit() {
    this.loadPaypalScript();

    // this.getContractUpdates();
    // initPaypal();
  }

  async loadPaypalScript() {
    let paypal: any;

    try {
        paypal = await loadScript({ clientId: "AUsmsmTQpWACUHNPRvhQuQkgfKVB-qSkOIRJoPB5oarQHnzqXcEGY8nfohUOjFedyZAnq30wsPafNiw9" });
        
        // paypal.Buttons().render('#paypal-button-container');

        var self = this;

        paypal.Buttons({
          onApprove(data: any) {
            self.contractService.confirmPayment(data);
          },

          onError(err: any) {
            // For example, redirect to a specific error page
            debugger;
            alert(err);
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
    this.openMetaMask(e.detail.value);
  }

  getContractUpdates() {
    this.contractUpdateInterval = setInterval(() => {
      this.getTokenData();
    }, 1000)
  }

  getTokenData() : void {
    this.contractService.getContractUpdateOb().pipe(
      delay(3000), 
      take(1),
      repeat()
      // takeUntilDestroyed(this.destroyRef)
    ).subscribe((resp: any): void => {
      this.countdown = this.calculateTimestampDifference(resp["currentTimestamp"],  resp["lastExecutedTimestamp"]);
      this.prizeMoney = resp["potEquity"];
      this.userWalletBalance = resp["userWalletBalance"];
      
      // return this.getTokenData();
    });


  //   this.contractService.getContractUpdateOb().pipe(
  //     // catchError((error: Error) => of({} as logViewDto)
  //     repeatWhen(obs => obs.pipe(delay(1000))), 
  //     take(1)
  //     // takeUntilDestroyed(this.destroyRef)
  // ).subscribe((resp: any) => {
  //       this.countdown = this.calculateTimestampDifference(resp["currentTimestamp"],  resp["lastExecutedTimestamp"]);
  //       this.prizeMoney = resp["potEquity"];
  //       this.userWalletBalance = resp["userWalletBalance"]  
  // })


    // interval(3000).pipe(
    //   switchMap(i => this.contractService.getContractUpdates())
    // ).subscribe(
    //   resp => { 
    //     this.countdown = this.calculateTimestampDifference(resp["currentTimestamp"],  resp["lastExecutedTimestamp"]);
    //     this.prizeMoney = resp["potEquity"];
    //     this.userWalletBalance = resp["userWalletBalance"]
    //   }
    // );


    // interval(5000).subscribe(x => {
    //   this.contractService.getContractUpdates().then((resp: any) => {
    //     this.countdown = this.calculateTimestampDifference(resp["currentTimestamp"],  resp["lastExecutedTimestamp"]);
    //     this.prizeMoney = resp["potEquity"];
    //     this.userWalletBalance = resp["userWalletBalance"]
    //     // this.countdown = resp.lastExecutedTimestamp;
    //   });
    // });


    // this.contractService.getContractUpdates().then((resp: any) => {
    //   this.countdown = this.calculateTimestampDifference(resp["currentTimestamp"],  resp["lastExecutedTimestamp"]);
    //   this.prizeMoney = resp["potEquity"];
    //   this.userWalletBalance = resp["userWalletBalance"]
    //   // this.countdown = resp.lastExecutedTimestamp;
    // })
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

  
  openMetaMask(walletType: ContractService.WALLET_TYPE) {
    this.contractService.openWallet(walletType).then(resp =>{
      this.walletConnected = resp ? true: false;
      this.senderAddress = resp;
    })
  }

  incrementPrizeMoney() {
    // this.prizeMoney += 50;
    // this.lastPrizeMoneyUpdate = new Date().getTime();
    // this.resetCountdown();

    this.contractService.sendTransaction();
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
