import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { Animation } from '@ionic/angular';
import { IonContent, IonCard, IonCardContent, IonButton, AnimationController } from "@ionic/angular/standalone";

@Component({
  selector: 'app-bouncing-ball',
  templateUrl: './bouncing-ball.component.html',
  styleUrls: ['./bouncing-ball.component.scss'],
  standalone: true,
  imports: [IonButton, IonCardContent, IonCard, IonContent, CommonModule]
})
export class BouncingBallComponent {
  @Input() x = 300; // Initial X position
  @Input() y = 200; // Initial Y position
  @Input() ballText = "";

  @ViewChild(IonCard, { read: ElementRef }) card: ElementRef<HTMLIonCardElement> | undefined;

  private animation: Animation | undefined;

  constructor(private animationCtrl: AnimationController) {}

  ngAfterViewInit() {
    const cardElement = this.card?.nativeElement;

    if(!cardElement) {
      return;
    }

    const card = this.animationCtrl
      .create()
      .addElement(cardElement)
      .duration(2000)
      .iterations(Infinity)
      .beforeStyles({
        filter: 'invert(75%)',
      })
      .beforeClearStyles(['box-shadow'])
      .afterStyles({
        'box-shadow': 'rgba(255, 0, 50, 0.4) 0px 4px 16px 6px',
      })
      .afterClearStyles(['filter'])
      .keyframes([
        { offset: 0, transform: 'scale(1)' },
        { offset: 0.5, transform: 'scale(1.5)' },
        { offset: 1, transform: 'scale(1)' },
      ]);

    this.animation = this.animationCtrl.create().duration(2000).addAnimation([card]);
    this.animation.play();
  }
}
