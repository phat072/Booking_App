import { StyleSheet } from 'react-native';

import Colors from './Colors';

const screenStyles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 25,
  },
  contentText: {
    alignSelf: 'flex-start',
    color: Colors.black,
    fontFamily: 'AvertaStd-Semibold',
    fontSize: 24,
    letterSpacing: -0.2,
    lineHeight: 28,
    paddingBottom: 20,
    paddingTop: 40,
  },
  darkBackground: {
    backgroundColor: Colors.black,
  },
  lightBackground: {
    backgroundColor: Colors.white,
  },
  screenContainer: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flex: 1,
    justifyContent: 'center',
  },
  stretch: {
    alignSelf: 'stretch',
  },
  stretchContainer: {
    alignSelf: 'stretch',
    flex: 1,
  },
  text: {
    color: "#000",
    fontSize : 17,
  },
});

export default screenStyles;