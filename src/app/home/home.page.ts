import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonFooter, IonGrid, IonCol, IonRow, IonText, IonIcon, IonSelect, IonList, IonItem, IonItemOption, IonSelectOption } from '@ionic/angular/standalone';
import { BouncingBallComponent } from '../bouncing-ball/bouncing-ball.component';
import { BouncingBallSimpleComponent } from '../bouncing-ball-simple/bouncing-ball-simple.component';
import { GameAreaComponent } from '../game/game-area.component';
import { ContractService } from '../service/contract.service';

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

  constructor(private contractService: ContractService) {    
  }

  ngOnInit() {
    // this.getContractUpdates();
    initPaypal();
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

  getTokenData() {
    this.contractService.getContractUpdates().then((resp: any) => {
      this.countdown = this.calculateTimestampDifference(resp["currentTimestamp"],  resp["lastExecutedTimestamp"]);
      this.prizeMoney = resp["potEquity"];
      // this.countdown = resp.lastExecutedTimestamp;
    })
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
