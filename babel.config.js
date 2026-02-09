module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // react-native-reanimated removed - using React Native's built-in Animated API instead
  };
};
