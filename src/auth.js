import Storage from "./services/Storage";
import {CHECKIN_LIST_SLUG} from "./constants";

export const isSignedIn = async () => {
  return (await Storage.getCheckinListSlug()) !== null;
};

export const onSignOut = () => {
  Storage.clearInfo(CHECKIN_LIST_SLUG);
};