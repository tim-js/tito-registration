import Api from './Api';
import config from '../config';

export type Event = {
  slug: string;
  title: string;
  description: string;
};

export type CheckinListSummary = {
  title: string;
  slug: string;
};

export default class TitoAdminApi {
  static getEvents(apiKey: string, teamSlug: string) {
    return Api.get(
      `${config.TITO_ADMIN_API_URL}/${teamSlug}/events`,
      {},
      { Authorization: `Token token=${apiKey}` },
    );
  }

  static getCheckinLists(apiKey: string, teamSlug: string, eventSlug: string) {
    return Api.get(
      `${config.TITO_ADMIN_API_URL}/${teamSlug}/${eventSlug}/checkin_lists`,
      {},
      { Authorization: `Token token=${apiKey}` },
    );
  }

  static getTicketData(
    apiKey: string,
    teamSlug: string,
    eventSlug: string,
    ticketSlug: string,
  ) {
    return Api.get(
      `${config.TITO_ADMIN_API_URL}/${teamSlug}/${eventSlug}/tickets/${ticketSlug}`,
      {},
      { Accept: 'application/json', Authorization: `Token token=${apiKey}` },
    );
  }

  static getAllTickets(
    apiKey: string,
    teamSlug: string,
    eventSlug: string,
    pageNumber = 1,
  ) {
    return Api.get(
      `${config.TITO_ADMIN_API_URL}/${teamSlug}/${eventSlug}/tickets?page=${pageNumber}`,
      {},
      { Authorization: `Token token=${apiKey}` },
    );
  }
}
