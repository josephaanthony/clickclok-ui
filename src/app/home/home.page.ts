import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonFooter, IonGrid, IonCol, IonRow, IonText, IonIcon } from '@ionic/angular/standalone';
import { BouncingBallComponent } from '../bouncing-ball/bouncing-ball.component';
import { BouncingBallSimpleComponent } from '../bouncing-ball-simple/bouncing-ball-simple.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonIcon, IonText, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonFooter, IonGrid, IonCol, IonRow, 
    CommonModule, BouncingBallComponent, BouncingBallSimpleComponent],
})
export class HomePage implements OnInit, OnDestroy {
  COUNT_RESET_VALUE = 300;

  prizeMoney = 0;
  countdown = this.COUNT_RESET_VALUE;
  countdownInterval: any;
  ballX = 0;
  ballY = 0;
  ballRadius = 25;
  ballSpeedX = 0;
  ballSpeedY = 2;
  lastPrizeMoneyUpdate = new Date().getTime();

  ngOnInit() {
    this.startCountdown();
    this.animateBall();
  }

  ngOnDestroy() {
    clearInterval(this.countdownInterval);
  }

  incrementPrizeMoney() {
    this.prizeMoney += 50;
    this.lastPrizeMoneyUpdate = new Date().getTime();
    this.resetCountdown();
  }

  startCountdown() {
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        this.resetCountdown();
      }
    }, 1000);
  }

  formatCountdown() {
    const minutes = Math.floor(this.countdown / 60);
    const seconds = this.countdown % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  resetCountdown() {
    this.countdown = this.COUNT_RESET_VALUE;
  }

  animateBall() {
    // requestAnimationFrame(this.animateBall.bind(this));

    const currentTime = new Date().getTime();
    const timeDiff = currentTime - this.lastPrizeMoneyUpdate;
    const ballSpeed = 0.5; // Adjust this value to control the ball speed

    this.ballX = (timeDiff / 1000) * ballSpeed; // Update X position based on time
    this.ballY = this.prizeMoney / 10; // Update Y position based on prize money

    // this.ballSpeedY += 0.9; // Increase vertical speed to create bouncing effect

    // // Add bouncing logic
    // const gameAreaWidth = 600; // Adjust this value based on your game area width
    // const gameAreaHeight = 400; // Adjust this value based on your game area height

    // if (this.ballY + this.ballRadius > gameAreaHeight) {
    //   this.ballY = gameAreaHeight - this.ballRadius;
    //   this.ballSpeedY = -Math.abs(this.ballSpeedY); // Reverse vertical speed with a small increase
    // } else {
    //   this.ballY += this.ballSpeedY;
    // }
  }
}
