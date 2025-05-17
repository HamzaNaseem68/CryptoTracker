const { getDefaultConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);
  const { assetExts, sourceExts } = defaultConfig.resolver;

  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      assetExts: [...assetExts, 'png', 'jpg', 'gif', 'jpeg', 'svg'],
      sourceExts: [...sourceExts, 'js', 'json', 'ts', 'tsx', 'cjs'],
      extraNodeModules: {
        'crypto': require.resolve('react-native-crypto'),
        'stream': require.resolve('stream-browserify'),
        'buffer': require.resolve('buffer/')
      }
    },
  };
})();
