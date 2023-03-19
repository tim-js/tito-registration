import Api from './Api';
import config from '../config';

export default class TitoCheckInApi {
  static getList(slug: string) {
    return Api.get(`${config.TITO_CHECKIN_API_URL}checkin_lists/${slug}`);
  }

  static getCheckins(slug: string, page: string | number) {
    return Api.get(
      `${config.TITO_CHECKIN_API_URL}checkin_lists/${slug}/checkins?page=${page}`,
    );
  }

  static checkinTicket(slug: string, ticketId: string | number) {
    return Api.post(
      `${config.TITO_CHECKIN_API_URL}checkin_lists/${slug}/checkins`,
      {
        checkin: { ticket_id: ticketId },
      },
    );
  }

  static getTicket(checkinSlug: string, ticketSlug: string) {
    return Api.get(
      `${config.TITO_CHECKIN_API_URL}checkin_lists/${checkinSlug}/tickets/${ticketSlug}`,
    );
  }
}
