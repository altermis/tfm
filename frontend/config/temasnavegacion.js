import { DefaultTheme as NavigationDefault, DarkTheme as NavigationDark } from '@react-navigation/native';

export const PlantDefaultTheme = {
  ...NavigationDefault,
  colors: {
    ...NavigationDefault.colors,
    
    background: '#F2FFF2',
    card: '#A8D5BA',
    text: '#083D20',
    border: '#83C09A',
    notification: '#5C9E7C',
  },
};

export const PlantDarkTheme = {
  ...NavigationDark,
  colors: {
    ...NavigationDark.colors,
    background: '#0D1F14',
    card: '#1B3A28',
    text: '#E0F7EC',
    border: '#2E5942',
    notification: '#87E2B4',
  },
};
