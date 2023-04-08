import {
  trigger,
  style,
  transition,
  animate,
  query,
  animateChild,
  group,
} from '@angular/animations';


export const routeAnimations = trigger('routeAnimations', [
  transition('* <=> slideIn', [
    baseStyle(),
    ...slideStyles('left'),
    ...slideAnimation('left'),
  ]),
  transition('* <=> fadeIn', [
    baseStyle(),
    ...fadeInOutAnimation(),
  ]),
  transition('* <=> *', [
    baseStyle(),
    ...fadeInOutAnimation(),
  ]),
]);

function baseStyle() {
  return style({position: 'relative'});
}

function slideStyles(direction: string) {
  return [
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          [direction]: 0,
          width: '100%',
        }),
      ],
      {optional: true}
    ),
    query(':enter', [style({[direction]: '-100%'})], {optional: true}),
  ];
}

function slideAnimation(direction: string) {
  return [
    query(':leave', animateChild(), {optional: true}),
    group([
      query(
        ':leave',
        [
          animate(
            '200ms ease-out',
            style({[direction]: '100%', opacity: 0})
          ),
        ],
        {optional: true}
      ),
      query(
        ':enter',
        [animate('300ms ease-out', style({[direction]: '0%'}))],
        {optional: true}
      ),
      query('@*', animateChild(), {optional: true}),
    ]),
  ];
}

function fadeInOutAnimation() {
  return [
    query(':enter, :leave', [style({opacity: 0})], {optional: true}),
    query(':leave', animateChild(), {optional: true}),
    group([
      query(
        ':leave',
        [animate('200ms ease-out', style({opacity: 0}))],
        {optional: true}
      ),
      query(':enter', [animate('300ms ease-in', style({opacity: 1}))], {
        optional: true,
      }),
      query('@*', animateChild(), {optional: true}),
    ]),
  ];
}
