import {RELOAD_SCREEN, SET_ACCOUNT_SETTINGS} from "../action-types";
import { CLEAR_ACCOUNT_SETTINGS } from "../action-types";
import { GET_ACCOUNT_SETTINGS } from "../action-types";
import { SET_EVENT_SLUG } from "../action-types";
import { GET_EVENT_SLUG } from "../action-types";

import Storage from "../../services/Storage";

export const setAccount = (apiKey, teamSlug) => async (dispatch, getState) => {
  const accountSettings = {
    apiKey: apiKey,
    teamSlug: teamSlug,
    checkinListSlug: null
  };

  await Storage.setAccountSettings(accountSettings);

  dispatch({ type: SET_ACCOUNT_SETTINGS, accountSettings: accountSettings });
};

export const setCheckinListSlug = checkinListSlug => async (dispatch, getState) => {
  const accountSettings = {
    apiKey: getState().accountSettings.apiKey,
    teamSlug: getState().accountSettings.teamSlug,
    checkinListSlug: checkinListSlug
  };

  await Storage.setAccountSettings(accountSettings);

  dispatch({ type: SET_ACCOUNT_SETTINGS, accountSettings: accountSettings });
};

export const getAccountSettings = () => async (dispatch, getState) => {
  const accountSettings = await Storage.getAccountSettings();

  dispatch({ type: SET_ACCOUNT_SETTINGS, accountSettings: accountSettings });
  return accountSettings;
};

export const setEventSlug = (eventSlug) => async (dispatch, getState) => {
  await Storage.setEventSlug(eventSlug);

  dispatch({ type: SET_EVENT_SLUG, eventSlug: eventSlug });
};

export const getEventSlug = () => async (dispatch, getState) => {
  const eventSlug = await Storage.getEventSlug();

  dispatch({ type: SET_EVENT_SLUG, eventSlug: eventSlug });

  return eventSlug;
};

export const clearAccount = () => (dispatch, getState) => {
  Storage.clearAccountSettings();

  dispatch({ type: CLEAR_ACCOUNT_SETTINGS });
};
