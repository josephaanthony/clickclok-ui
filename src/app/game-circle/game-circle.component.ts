import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { AnimationBuilder, style, animate } from '@angular/animations';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonFooter, IonGrid, IonCol, IonRow, IonText, IonIcon } from '@ionic/angular/standalone';
import * as Highcharts from 'highcharts';
import * as HighchartsMore from 'highcharts/highcharts-more'; // Import highcharts-more for gauge chart
import * as HighchartsGauge from 'highcharts/modules/solid-gauge'; // Import solid-gauge for solid gauge chart
// import { Moment } from 'moment/moment';

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
  @Input() secondsSpent: any = 0;

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
      this.duration = Number(changes["duration"].currentValue);
    }

    if(changes["secondsSpent"]) {
      this.secondsSpent = Number(changes["secondsSpent"].currentValue);
    }

    if(changes["duration"] || changes["secondsSpent"]) {
      this.startTimer();  
    }
  }

  clearIntervalInternal() {
    if(this.intervalId != null) {
      clearInterval(this.intervalId);
      this.intervalId = null;  
    }
  }

  ngOnDestroy(): void {
    this.clearIntervalInternal();
  }

  startTimer(): void {
    if(this.secondsSpent < 0 || isNaN(this.secondsSpent) || this.duration <= 0) {
      return;
    }

    // reset interval if its already started.
    if(this.intervalId != null) {
      this.clearIntervalInternal();
    }

    const startTime = Date.now() - this.secondsSpent * 1000;
    const endTime = startTime + this.duration * 1000;

    this.intervalId = setInterval(() => {
      const now = Date.now();
      const secondsLeft = (endTime - now) / 1000; // in milliseconds

      // let secondsLeft = 0;

      // if(firstRun) {
      //   secondsLeft = this.secondsSpent;
      //   firstRun = false;
      // } else {
      //   secondsLeft = Math.max(0, Math.floor(timeLeft / 1000));
      // }

      // const secondsLeft = Math.floor(timeLeft / 1000);
      // this.displayTime = this.formatTime(secondsLeft);

      // if(secondsLeft >= 0) {
      //   this.offset = (this.circumference * secondsLeft) / this.duration - this.circumference;
  
      //   const progress = 1 - ((secondsLeft-76) / this.duration);
      //   const angle = progress * 2 * Math.PI - Math.PI / 2; // Start from the bottom (270 degrees)
      //   this.startX = 60 + 54 * Math.cos(angle);
      //   this.startY = 60 + 54 * Math.sin(angle);  
      // } else {
      //   clearInterval(this.intervalId);
      // }

      // const secondsLeft = this.duration - this.secondsSpent;
      this.displayTime = this.formatTime(secondsLeft);

      if(secondsLeft >= 0) {
        this.offset = (this.circumference * secondsLeft) / this.duration - this.circumference;
        const progress = 1 - ((secondsLeft-76) / this.duration);
        const angle = progress * 2 * Math.PI - Math.PI / 2; // Start from the bottom (270 degrees)
        this.startX = 60 + 54 * Math.cos(angle);
        this.startY = 60 + 54 * Math.sin(angle);    
      } else {
        this.clearIntervalInternal();
      }
      
    }, 1000);
  }

  formatTime(secondsLeft: number): string {
    if(secondsLeft < 0) {
      return 'Game Over';
    } else {
      const minutes = Math.floor(secondsLeft / 60);
      const remainingSeconds = Math.floor(secondsLeft % 60);
      return `${this.pad(minutes)}:${this.pad(remainingSeconds)}`;  
    }
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}
