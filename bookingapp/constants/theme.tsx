import { Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

type ColorTypes = {
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
};

type SizeTypes = {
  xSmall: number;
  small: number;
  medium: number;
  large: number;
  xLarge: number;
  xxLarge: number;
  height: number;
  width: number;
};

type ShadowTypes = {
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
};

const COLORS: ColorTypes = {
  primary: "red",
  primary1: "#00fff53c",
  secondary: "#ffa44f",
  secondary1: "#ffe5db",
  tertiary: "#0078a6",
  gray: "#83829A",
  gray2: "#C1C0C8",
  lightGray: "#ccc",
  white: "#FFFFFF",
  offwhite: "#FFFFFF",
  error: "red",
  black: "#000000",
  red: "#e81e4d",
  green: "#00C135",
  lightWhite: "#FFFFFF",
};

const SIZES: SizeTypes = {
  xSmall: 10,
  small: 12,
  medium: 16,
  large: 20,
  xLarge: 24,
  xxLarge: 44,
  height,
  width
};

const SHADOWS: ShadowTypes = {
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
