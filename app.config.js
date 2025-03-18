import "dotenv/config";

export default ({ config }) => {
  return {
    ...config,
    // Add your environment variables to the "extra" field
    android: {
      ...config.android,
      config: {
        ...config.android.config,
        googleMaps: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
    ios: {
      ...config.ios,
      config: {
        ...config.ios.config,
        googleMaps: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
    extra: {
      ...config.extra,
      parablForeshadowApiHost:
        process.env.PARABL_FORESHADOW_API_HOST ||
        "https://foreshadow.parabl.io",
      googleApiKey: process.env.GOOGLE_MAPS_API_KEY,
      eas: {
        projectId: process.env.PROJECT_ID,
      },
      apiBasePath: process.env.API_BASE_PATH,
      // Add other env variables as needed
    },
  };
};
