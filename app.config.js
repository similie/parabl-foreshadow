import "dotenv/config";

export default ({ config }) => {
  return {
    ...config,
    // Add your environment variables to the "extra" field
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
