import { Dimensions } from 'react-native';
import Colors from './Colors';

const { height, width } = Dimensions.get('window');

interface Colors {
  primary: string;
  primary1: string;
  secondary: string;
  secondary1: string;
  tertiary: string;
  gray: string;
  gray2: string;
  lightGray: string;
  white: string;
  offwhite: string;
  error: string;
  black: string;
  red: string;
  green: string;
  lightWhite: string;
}

const COLORS: Colors = {
  primary: Colors.primary,
  primary1: "#00fff53c",
  secondary: "#ffa44f",
  secondary1: "#ffe5db",
  tertiary: "#0078a6",
  gray: "#83829A",
  gray2: "#C1C0C8",
  lightGray: "#ccc",
  white: "#ffffff",
  offwhite: "#FFFFFF",
  error: Colors.primary,
  black: "#000000",
  red: "#e81e4d",
  green: "#00C135",
  lightWhite: "#FFFFFF",
};

interface Sizes {
  xSmall: number;
  small: number;
  medium: number;
  large: number;
  xLarge: number;
  xxLarge: number;
  height: number;
  width: number;
}

const SIZES: Sizes = {
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 44,
  height,
  width,
};

interface Shadows {
  small: {
    shadowColor: string;
    shadowOffset: {
      width: number;
      height: number;
    };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
  medium: {
    shadowColor: string;
    shadowOffset: {
      width: number;
      height: number;
    };
    shadowOpacity: number;
    shadowRadius: number;
    elevation: number;
  };
}

const SHADOWS: Shadows = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
};

export { COLORS, SIZES, SHADOWS };