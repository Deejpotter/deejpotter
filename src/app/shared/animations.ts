import {
  trigger,
  style,
  transition,
  animate,
  query,
  animateChild,
  group,
  sequence,
} from '@angular/animations';

export const routeAnimations = trigger('routeAnimations', [
  transition('* <=> slideIn', [
    baseStyle(),
    ...slideInOutSequenceAnimation('left'),
  ]),
  transition('* <=> fadeIn', [
    baseStyle(),
    ...fadeInOutSequenceAnimation(),
  ]),
  transition('* <=> *', [
    baseStyle(),
    ...fadeInOutSequenceAnimation(),
  ]),
]);

function baseStyle() {
  return style({position: 'relative'});
}

function slideInOutSequenceAnimation(direction: string) {
  return [
    query(':enter', [
      style({
        position: 'absolute',
        top: 0,
        [direction]: 0,
        width: '100%',
        opacity: 0,
      }),
    ], {optional: true}),
    query(':leave', animateChild(), {optional: true}),
    group([
      query(':leave', [
        animate('200ms ease-out', style({[direction]: '100%', opacity: 0})),
      ], {optional: true}),
      query(':enter', [
        animate('300ms ease-out', style({[direction]: '0%', opacity: 1})),
      ], {optional: true}),
    ]),
  ];
}

function fadeInOutSequenceAnimation() {
  return [
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        opacity: 0,
      }),
    ], {optional: true}),
    query(':leave', animateChild(), {optional: true}),
    sequence([
      query(':leave', [
        animate('200ms ease-out', style({opacity: 0})),
      ], {optional: true}),
      query(':enter', [
        animate('300ms ease-in', style({opacity: 1})),
      ], {optional: true}),
    ]),
  ];
}
