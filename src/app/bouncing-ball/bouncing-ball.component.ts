import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-bouncing-ball',
  templateUrl: './bouncing-ball.component.html',
  styleUrls: ['./bouncing-ball.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class BouncingBallComponent  implements OnInit {
  @Input() x = 300; // Initial X position
  @Input() y = 200; // Initial Y position

  ballX = 0; // Initial X position
  ballY = 0; // Initial Y position
  ballSpeedX = 0; // X speed
  ballSpeedY = -0.5; // Y speed
  ballRadius = 25;
  requestId: any;
  ballTransform = '';


  ngOnInit() {
    this.resetBallPosition();
    this.animateBall();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['x'] || changes['y']) {
      this.resetBallPosition();
    }
  }

  resetBallPosition() {
    this.ballX = this.x;
    this.ballY = this.y;
  }
  
  animateBall() {
    this.requestId = requestAnimationFrame(this.animateBall.bind(this));

    // Update ball position
    this.ballY += this.ballSpeedY;

    // Add bouncing logic
    const gameAreaHeight = 500;
    const bouncingRange = 100; // Bouncing range in pixels

    // if (this.ballY + this.ballRadius > gameAreaHeight) {
    //   this.ballY = gameAreaHeight - this.ballRadius;
    //   this.ballSpeedY = -Math.abs(this.ballSpeedY); // Reverse vertical speed with a small increase
    // } 
    // else if (this.ballY - this.ballRadius < gameAreaHeight - bouncingRange) {
    //   this.ballY = gameAreaHeight - bouncingRange + this.ballRadius;
    //   this.ballSpeedY = Math.abs(this.ballSpeedY); // Reverse vertical speed with a small increase
    // }

    // Apply 3D transformation
    const bouncingFactor = Math.abs(Math.sin((this.ballY - gameAreaHeight + bouncingRange) / bouncingRange * Math.PI));
    this.ballTransform = `translateY(${this.ballY - gameAreaHeight + bouncingRange}px) scale(${1 + bouncingFactor * 0.5})`;
  }
}
