import Api from "./Api";
import config from "../config";

export default class TitoCheckInApi {
  static getList(slug) {
    return Api.get(`${config.TITO_CHECKIN_API_URL}checkin_lists/${slug}`);
  }

  static getCheckins(slug) {
    return Api.get(
      `${config.TITO_CHECKIN_API_URL}checkin_lists/${slug}/checkins`
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
}
