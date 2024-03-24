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
  selector: 'app-game-area',
  templateUrl: './game-area.component.html',
  styleUrls: ['./game-area.component.scss'],
  imports: [CommonModule, IonContent],
  standalone: true
})
export class GameAreaComponent implements OnInit {
  @Input() prizeMoneyInput: any = 0;
  @Input() currentTimeInput: any = 0;

  countdownInterval: any;
  chart: any;

  maxTime = 200;


  ngOnChanges(changes: SimpleChanges): void {
    this.updateTime(changes["currentTimeInput"], changes["prizeMoneyInput"]);
  }

  ngOnInit(): void {
    this.drawChart();
    this.playAnimation();
  }

  drawChart() {
    this.chart = (Highcharts as any).chart('container', {

      chart: {
          type: 'gauge',
          plotBackgroundColor: null,
          plotBackgroundImage: null,
          plotBorderWidth: 0,
          plotShadow: false,
          height: '80%'
      },
  
      title: {
          text: '$$ 0'
      },
  
      pane: {
          startAngle: -90,
          endAngle: 89.9,
          background: null,
          center: ['50%', '75%'],
          size: '110%'
      },
  
      // the value axis
      yAxis: {
          min: 0,
          max: this.maxTime,
          tickPixelInterval: 72,
          tickPosition: 'inside',
          tickColor: Highcharts?.defaultOptions?.chart?.backgroundColor || '#FFFFFF',
          tickLength: 20,
          tickWidth: 2,
          minorTickInterval: null,
          labels: {
              distance: 20,
              style: {
                  fontSize: '14px'
              }
          },
          lineWidth: 0,
          plotBands: [{
              from: 0,
              to: 120,
              color: '#55BF3B', // green
              thickness: 20
          }, {
              from: 120,
              to: 160,
              color: '#DDDF0D', // yellow
              thickness: 20
          }, {
              from: 160,
              to: 200,
              color: '#DF5353', // red
              thickness: 20
          }]
      },
  
      series: [{
          name: 'Speed',
          data: [200],
          tooltip: {
              valueSuffix: ' sec'
          },
          dataLabels: {
              format: '{y} sec',
              borderWidth: 0,
              color: (
                  Highcharts.defaultOptions.title &&
                  Highcharts.defaultOptions.title.style &&
                  Highcharts.defaultOptions.title.style.color
              ) || '#333333',
              style: {
                  fontSize: '16px'
              }
          },
          dial: {
              radius: '80%',
              backgroundColor: 'gray',
              baseWidth: 12,
              baseLength: '0%',
              rearLength: '0%'
          },
          pivot: {
              backgroundColor: 'gray',
              radius: 6
          }
  
      }]
  
  });
  }

  playAnimation() {
    this.countdownInterval = setInterval(() => {
      if (this.chart && !this.chart.renderer.forExport) {
        const point = this.chart.series[0].points[0];
        if(point.y) {
          point.update(point.y - 1);
        }
      }
    }, 1000);
  }

  updateTime(currentTimeInput: any, prizeMoneyInput: any) {
    if(this.chart && this.chart.series) {

      if(currentTimeInput && currentTimeInput.currentValue < this.maxTime) {
        this.chart.series[0].points[0].update(this.maxTime - currentTimeInput.currentValue);
      }

      if(prizeMoneyInput) {
        this.chart.setTitle({ text: '$$ ' + prizeMoneyInput.currentValue });
      }
    }
  }
}
