import { SET_ACCOUNT_SETTINGS} from "../action-types";
import { CLEAR_ACCOUNT_SETTINGS } from "../action-types";

import Storage from "../../services/Storage";

export const setAccount = (apiKey, teamSlug) => async (dispatch, getState) => {
  const accountSettings = {
    apiKey: apiKey,
    teamSlug: teamSlug,
    checkinListSlug: null,
    eventSlug: null,
  };

  await Storage.setAccountSettings(accountSettings);

  dispatch({ type: SET_ACCOUNT_SETTINGS, accountSettings: accountSettings });
};

export const setCheckinListSlug = checkinListSlug => async (dispatch, getState) => {
  const accountSettings = {
    apiKey: getState().accountSettings.apiKey,
    teamSlug: getState().accountSettings.teamSlug,
    checkinListSlug: checkinListSlug,
    eventSlug: null,
  };

  await Storage.setAccountSettings(accountSettings);

  dispatch({ type: SET_ACCOUNT_SETTINGS, accountSettings: accountSettings });
};


export const setEventSlug = eventSlug => async (dispatch, getState) => {
  const accountSettings = {
    apiKey: getState().accountSettings.apiKey,
    teamSlug: getState().accountSettings.teamSlug,
    checkinListSlug: getState().accountSettings.checkinListSlug,
    eventSlug: eventSlug,
  };

  await Storage.setAccountSettings(accountSettings);

  dispatch({ type: SET_ACCOUNT_SETTINGS, accountSettings: accountSettings });
};

export const getAccountSettings = () => async (dispatch, getState) => {
  const accountSettings = await Storage.getAccountSettings();

  dispatch({ type: SET_ACCOUNT_SETTINGS, accountSettings: accountSettings });
  return accountSettings;
};

export const clearAccount = () => (dispatch, getState) => {
  Storage.clearAccountSettings();

  dispatch({ type: CLEAR_ACCOUNT_SETTINGS });
};
