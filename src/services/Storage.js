import { AsyncStorage } from "react-native";
import {CHECKIN_LIST_SLUG} from "../constants";

export default class Storage {
  static getCheckinListSlug() {
    return Storage.getStorageInfo(CHECKIN_LIST_SLUG);
  }

  static setCheckinListSlug(checkinListSlug) {
    Storage.setStorageInfo(CHECKIN_LIST_SLUG, checkinListSlug);
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
