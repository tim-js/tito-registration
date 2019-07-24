import {SET_ACCOUNT_SETTINGS} from "../action-types";
import {CLEAR_ACCOUNT_SETTINGS} from "../action-types";
import { GET_ACCOUNT_SETTINGS } from "../action-types";

import {CHECKIN_LIST_SLUG} from "../../constants";

import Storage from "../../services/Storage";

export const setAccount = (checkinListSlug) => async (dispatch, getState) => {
  const accountSettings = {
    checkinListSlug: checkinListSlug
  };

  await Storage.setCheckinListSlug(checkinListSlug);

  dispatch({type: SET_ACCOUNT_SETTINGS, accountSettings: accountSettings});
};

export const getAccountSettings = () => async (dispatch, getState) => {
  const accountSettings = {
    checkinListSlug: await Storage.getCheckinListSlug()
  };

  dispatch({type: GET_ACCOUNT_SETTINGS, accountSettings: accountSettings});
};


export const clearAccount = () => (dispatch, getState) => {
  Storage.clearInfo(CHECKIN_LIST_SLUG);

  dispatch({ type: CLEAR_ACCOUNT_SETTINGS });
};
