import { Ntfy } from 'Shared/Ntfy';

/**
 * @name Ntfy - Send Notification
 * @uid 111c76e6-64ae-40b2-b553-d508b4e1a054
 * @description Publishes a notification to ntfy. Empty values inherit from global Ntfy variables.
 * @author get-fooby
 * @revision 4
 * @minimumVersion 24.09.1.0
 * @help Configure Ntfy.Topic and optional Ntfy.Url or Ntfy.AccessToken in FileFlows Variables. Content defaults use Ntfy.Title, Ntfy.Message, and Ntfy.Priority.
 * @param {string} URL Optional ntfy server URL override. Defaults to Ntfy.Url or https://ntfy.sh.
 * @param {string} Topic Optional topic override. Defaults to Ntfy.Topic.
 * @param {string} Title Optional notification title override.
 * @param {string} Message Optional notification body override. Supports FileFlows templates.
 * @param {('Global'|'Min'|'Low'|'Default'|'High'|'Max')} Priority Notification priority, or Global to inherit Ntfy.Priority.
 * @output Message sent
 */
function Script(URL, Topic, Title, Message, Priority)
{
    var ntfy = new Ntfy(URL, Topic);
    return ntfy.sendMessage(Title, Message, Priority) ? 1 : -1;
}
