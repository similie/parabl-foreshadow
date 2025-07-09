import "dotenv/config";

export default ({ config }) => {
  const conf = {
    ...config,
    // Add your environment variables to the "extra" field
    android: {
      ...config.android,
      config: {
        ...config.android.config,
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    },
    ios: {
      ...config.ios,
      config: {
        ...config.ios.config,
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
    extra: {
      ...config.extra,
      parablForeshadowApiHost:
        process.env.PARABL_FORESHADOW_API_HOST || "https://4shadow.parabl.io",
      googleApiKey: process.env.GOOGLE_MAPS_API_KEY,
      eas: {
        projectId: process.env.PROJECT_ID,
      },
      apiBasePath: process.env.API_BASE_PATH,
      // Add other env variables as needed
    },
  };
  return conf;
};
