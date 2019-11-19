import Storage from "./services/Storage";

export const isSignedIn = async () => {
  let accountSettings = await Storage.getAccountSettings();
  return (
    accountSettings.apiKey !== null
    && accountSettings.teamSlug !== null
    && accountSettings.eventSlug !== null
    && accountSettings.checkinListSlug !== null
  );
};