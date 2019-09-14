import Api from './Api';
import config from '../config';

export default class TitoAdminApi {
  static getEvents(apiKey, teamSlug) {
    return Api.get(`${config.TITO_ADMIN_API_URL}/${teamSlug}/events`, {}, { 'Authorization': `Token token=${apiKey}` });
  }

  static getCheckinLists(apiKey, teamSlug, eventSlug) {
    return Api.get(`${config.TITO_ADMIN_API_URL}/${teamSlug}/${eventSlug}/checkin_lists`, {}, { 'Authorization': `Token token=${apiKey}` });
  }

  static getTicketData(apiKey, teamSlug, eventSlug, ticketSlug) {
    return Api.get(`${config.TITO_ADMIN_API_URL}/${teamSlug}/${eventSlug}/tickets/${ticketSlug}`, {}, { 'Authorization': `Token token=${apiKey}` });
  }

  static getAllTickets(apiKey, teamSlug, eventSlug, pageNumber = 1) {
    return Api.get(`${config.TITO_ADMIN_API_URL}/${teamSlug}/${eventSlug}/tickets?page=${pageNumber}`, {}, { 'Authorization': `Token token=${apiKey}` });
  }
}