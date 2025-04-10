// home.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../hero/hero.component';
import { HowItWorksComponent } from '../how-it-works/how-it-works.component';
import { FeaturesComponent } from '../features/features.component';
import { NgoSpotlightComponent } from '../ngo-spotlight/ngo-spotlight.component';
import { GamificationComponent } from '../gamification/gamification.component';
import { DonationComponent } from '../donation/donation.component';
import { CtaComponent } from '../cta/cta.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    HowItWorksComponent,
    FeaturesComponent,
    NgoSpotlightComponent,
    GamificationComponent,
    DonationComponent,
    CtaComponent
  ],
  template: `
    <app-hero></app-hero>
    <app-how-it-works id="how-it-works"></app-how-it-works>
    <app-features id="features"></app-features>
    <app-ngo-spotlight id="ngo-spotlight"></app-ngo-spotlight>
    <app-gamification id="gamification"></app-gamification>
    <app-donation id="donation"></app-donation>
    <app-cta id="cta"></app-cta>
  `
})
export class HomeComponent {}