import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Cinema',
    icon: 'shopping-cart-outline',
    link: '/pages/cinema',
    home: true,
    children: [
      {
        title: '404',
        link: '/pages/cinema/404',
      },
    ],
  },
];
