import Api from "./Api";
import config from "../config";

export default class TitoCheckInApi {
  static getList(slug) {
    return Api.get(`${config.TITO_CHECKIN_API_URL}checkin_lists/${slug}`);
  }

  static getCheckins(slug, page) {
    return Api.get(
      `${config.TITO_CHECKIN_API_URL}checkin_lists/${slug}/checkins?page=${page}`
    );
  }

  static checkinTicket(slug, ticketId) {
    return Api.post(
      `${config.TITO_CHECKIN_API_URL}checkin_lists/${slug}/checkins`,
      {
        checkin: { ticket_id: ticketId }
      }
    );
  }

  static getTicket(checkinSlug, ticketSlug) {
    return Api.get(
      `${config.TITO_CHECKIN_API_URL}checkin_lists/${checkinSlug}/tickets/${ticketSlug}`
    );
  }
}
