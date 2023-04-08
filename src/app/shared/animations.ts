import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

export const slideInAnimation = trigger('slideIn', [
  state('start', style({transform: 'translateX(100%)'})),
  state('end', style({transform: 'translateX(0)'})),
  transition('start => end', animate('250ms cubic-bezier(0.35, 0, 0.25, 1)')),
]);

export const fadeInAnimation = trigger('fadeIn', [
  state('start', style({opacity: 0})),
  state('end', style({opacity: 1})),
  transition('start => end', animate('250ms ease-in')),
]);

export const scaleInAnimation = trigger('scaleIn', [
  state('start', style({transform: 'scale(0)'})),
  state('end', style({transform: 'scale(1)'})),
  transition('start => end', animate('250ms ease-out')),
]);

export const rotateAnimation = trigger('rotate', [
  state('start', style({transform: 'rotate(0deg)'})),
  state('end', style({transform: 'rotate(360deg)'})),
  transition('start => end', animate('500ms ease-in-out')),
]);
