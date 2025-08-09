import { DefaultTheme as NavigationDefault, DarkTheme as NavigationDark } from '@react-navigation/native';

export const lightTheme = {
  colors: {
    background: '#e1fee3',
    text: '#000000',
    subtle: '#666666',
    primary: '#4CAF50',
    buttonBackground: '#4CAF50',
    buttonText: '#ffffff',
    card: '#A8D5BA',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
};

export const darkTheme = {
  colors: {
    background: '#115a17',
    text: '#ffffff',
    subtle: '#BBBBBB',
    primary: '#1e90ff',
    buttonBackground: '#103a13',
    buttonText: '#ffffff',
    card: '#1B3A28', 
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
};



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
