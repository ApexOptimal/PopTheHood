const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);
const stubPath = path.resolve(__dirname, 'src/utils/purchasesUIStub.js');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react-native-purchases-ui') {
    try {
      return context.resolveRequest(context, moduleName, platform);
    } catch (e) {
      return { type: 'sourceFile', filePath: stubPath };
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
