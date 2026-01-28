module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-element-dropdown|react-native-month-year-picker|react-native-vector-icons|@react-native-community|react-native-calendar-picker|react-native-modal|react-native-animatable|react-native-linear-gradient)/)',
  ],
};
