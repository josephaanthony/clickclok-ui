import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-game-area',
  templateUrl: './game-area.component.html',
  styleUrls: ['./game-area.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, CommonModule]
})
export class GameAreaComponent implements OnInit {
  ballX = 300; // Initial X position
  ballY = 200; // Initial Y position
  prizeMoneyLocation = this.ballY;
  ballSpeedX = 0; // X speed
  ballSpeedY = 1.5; // Y speed
  ballRadius = 25;
  requestId: any;
  ballTransform = '';

  ngOnInit() {
    this.animateBall();
  }

  animateBall() {
    this.requestId = requestAnimationFrame(this.animateBall.bind(this));

    // Update ball position
    this.ballY += this.ballSpeedY;

    // Add bouncing logic
    const gameAreaHeight = 400;
    const bouncingRange = 100; // Bouncing range in pixels

    if (this.ballY + this.ballRadius > gameAreaHeight) {
      this.ballY = gameAreaHeight - this.ballRadius;
      this.ballSpeedY = -Math.abs(this.ballSpeedY); // Reverse vertical speed with a small increase
    } else if (this.ballY - this.ballRadius < gameAreaHeight - bouncingRange) {
      this.ballY = gameAreaHeight - bouncingRange + this.ballRadius;
      this.ballSpeedY = Math.abs(this.ballSpeedY); // Reverse vertical speed with a small increase
    }

    // Apply 3D transformation
    const bouncingFactor = Math.abs(Math.sin((this.ballY - gameAreaHeight + bouncingRange) / bouncingRange * Math.PI));
    this.ballTransform = `translateY(${this.ballY - gameAreaHeight + bouncingRange}px) scale(${1 + bouncingFactor * 0.5})`;
  }

  animateBallOld() {
    this.requestId = requestAnimationFrame(this.animateBall.bind(this));

    // Update ball position
    this.ballY += this.ballSpeedY;

    const ballUpBoundary = this.prizeMoneyLocation - 150;
    // const ballDownBoundary = this.ballY + 50;

    // Add bouncing logic
    const gameAreaHeight = 400;

    if (this.ballY + (this.ballRadius * 2) > this.prizeMoneyLocation) {
      this.ballY = this.prizeMoneyLocation - (this.ballRadius * 2);
      this.ballSpeedY = -Math.abs(this.ballSpeedY); // Reverse vertical speed with a small increase
    }

    if (this.ballY < ballUpBoundary) {
      // this.ballY = gameAreaHeight - this.ballRadius;
      this.ballSpeedY = +Math.abs(this.ballSpeedY); // Reverse vertical speed with a small increase
    }
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.requestId);
  }
}