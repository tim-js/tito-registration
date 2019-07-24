import Storage from "./services/Storage";
import {CHECKIN_LIST_SLUG} from "./constants";

export const isSignedIn = () => {
  return Storage.getCheckinListSlug() !== null;
};

export const onSignOut = () => {
  Storage.clearInfo(CHECKIN_LIST_SLUG);
};