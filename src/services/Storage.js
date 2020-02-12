import { AsyncStorage } from "react-native";
import {EVENT_SLUG, CHECKIN_LIST_SLUG, API_KEY, TEAM_SLUG} from "../constants";

export default class Storage {
  static setAccountSettings = async (accountSettings) => {
    if(accountSettings.checkinListSlug) {
      await Storage.setStorageInfo(CHECKIN_LIST_SLUG, accountSettings.checkinListSlug);
    }
    if(accountSettings.apiKey) {
      await Storage.setStorageInfo(API_KEY, accountSettings.apiKey);
    }
    if(accountSettings.apiKey) {
      await Storage.setStorageInfo(TEAM_SLUG, accountSettings.teamSlug);
    }
    if(accountSettings.eventSlug) {
      await Storage.setStorageInfo(EVENT_SLUG, accountSettings.eventSlug);
    }
  };

  static getAccountSettings = async () => {
    return {
      checkinListSlug: await Storage.getStorageInfo(CHECKIN_LIST_SLUG),
      apiKey:          await Storage.getStorageInfo(API_KEY),
      teamSlug:        await Storage.getStorageInfo(TEAM_SLUG),
      eventSlug:       await Storage.getStorageInfo(EVENT_SLUG)
    }
  };

  static clearAccountSettings() {
    Storage.clearInfo(CHECKIN_LIST_SLUG);
    Storage.clearInfo(API_KEY);
    Storage.clearInfo(TEAM_SLUG);
    Storage.clearInfo(EVENT_SLUG);
  }

  static getStorageInfo = async (key) => {
    try {
      return await AsyncStorage.getItem(key, () => {});
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  static setStorageInfo(key, info) {
    try {
      AsyncStorage.setItem(key, info, () => {});
    } catch (error) {
      console.error(error);
    }
  }

  static clearInfo(key) {
    try {
      AsyncStorage.removeItem(key, () => {});
    } catch (error) {
      console.error(error);
    }
  }
}
