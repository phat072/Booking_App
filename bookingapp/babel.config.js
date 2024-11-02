module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo',
      '@babel/preset-typescript', // Thêm preset cho TypeScript
    ],
    plugins: [
      'react-native-reanimated/plugin', // Đảm bảo plugin này được đặt ở cuối
      ['module:react-native-dotenv', {
        moduleName: '@env',
        path: '.env',
      }]
    ],
  };
};