import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { AnimationBuilder, style, animate } from '@angular/animations';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonFooter, IonGrid, IonCol, IonRow, IonText, IonIcon } from '@ionic/angular/standalone';
import * as Highcharts from 'highcharts';
import * as HighchartsMore from 'highcharts/highcharts-more'; // Import highcharts-more for gauge chart
import * as HighchartsGauge from 'highcharts/modules/solid-gauge'; // Import solid-gauge for solid gauge chart

// Initialize the modules
(HighchartsMore as any)(Highcharts);
(HighchartsGauge as any)(Highcharts);

@Component({
  selector: 'app-circle-area',
  templateUrl: './game-circle.component.html',
  styleUrls: ['./game-circle.component.scss'],
  imports: [CommonModule, IonContent],
  standalone: true
})
export class GameCircleComponent implements OnInit {
  @Input() duration: any = 0; // default duration is 60 seconds
  @Input() secondsRemaining: any = 0;

  circumference = 2 * Math.PI * 54;
  offset = this.circumference;
  displayTime: string = 'Game Not Started Yet';
  startX: number = 80;
  startY: number = 80; // Initial position at the top of the circle

  private intervalId: any;

  ngOnInit(): void {
    this.startTimer();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["duration"]) {
      this.duration = changes["duration"].currentValue;
    }

    if(changes["secondsRemaining"]) {
      this.secondsRemaining = changes["secondsRemaining"].currentValue;
    }

    if(changes["duration"] || changes["secondsRemaining"]) {
      clearInterval(this.intervalId);
      this.startTimer();  
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  startTimer(): void {
    if(this.secondsRemaining <= 0) {
      return;
    }

    const startTime = Date.now();
    const endTime = startTime + this.duration * 1000;

    let firstRun = true;

    this.intervalId = setInterval(() => {
      const now = Date.now();
      const timeLeft = endTime - now;

      let secondsLeft = 0;

      if(firstRun) {
        secondsLeft = this.secondsRemaining;
        firstRun = false;
      } else {
        secondsLeft = Math.max(0, Math.floor(timeLeft / 1000));
      }

      this.displayTime = this.formatTime(secondsLeft);
      this.offset = (this.circumference * secondsLeft) / this.duration - this.circumference;

      const progress = 1 - ((secondsLeft-76) / this.duration);
      const angle = progress * 2 * Math.PI - Math.PI / 2; // Start from the bottom (270 degrees)
      this.startX = 60 + 54 * Math.cos(angle);
      this.startY = 60 + 54 * Math.sin(angle);

      if (timeLeft <= 0 || timeLeft > this.duration) {
        clearInterval(this.intervalId);
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    if(seconds == this.duration) {
      return 'Game Not Started Yet';
    }
    if(seconds == 0 || seconds > this.duration) {
      return 'Game Over';
    } else {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${this.pad(minutes)}:${this.pad(remainingSeconds)}`;  
    }
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}
