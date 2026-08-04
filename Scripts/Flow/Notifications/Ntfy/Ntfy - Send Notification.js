import { Ntfy } from 'Shared/Ntfy';

/**
 * @name Ntfy - Send Notification
 * @uid 111c76e6-64ae-40b2-b553-d508b4e1a054
 * @description Publishes a notification to ntfy. Empty values inherit from global Ntfy variables.
 * @author FileFlows Community
 * @revision 2
 * @minimumVersion 24.09.1.0
 * @help Configure Ntfy.Topic and optional Ntfy.ServerUrl, Ntfy.AccessToken or Ntfy.Username/Ntfy.Password in FileFlows Variables. Content defaults use Ntfy.Title, Ntfy.Message, Ntfy.Priority, Ntfy.Tags, Ntfy.Markdown, Ntfy.ClickUrl, Ntfy.IconUrl, Ntfy.AttachmentUrl, Ntfy.Filename, Ntfy.Actions, Ntfy.Delay, Ntfy.Email, Ntfy.Call, Ntfy.SequenceId, Ntfy.Cache, and Ntfy.Firebase.
 * @param {string} ServerUrl Optional ntfy server URL override. Defaults to Ntfy.ServerUrl or https://ntfy.sh.
 * @param {string} Topic Optional topic override. Defaults to Ntfy.Topic.
 * @param {string} Title Optional notification title override.
 * @param {string} Message Optional notification body override. Supports FileFlows templates.
 * @param {('Global'|'Min'|'Low'|'Default'|'High'|'Max')} Priority Notification priority, or Global to inherit Ntfy.Priority.
 * @param {string} Tags Comma-separated tags or emoji shortcodes, for example warning,computer.
 * @param {('Global'|'Enabled'|'Disabled')} Markdown Enable Markdown formatting or inherit Ntfy.Markdown.
 * @param {string} ClickUrl URI opened when the notification is selected.
 * @param {string} IconUrl HTTP or HTTPS URL of a PNG or JPEG notification icon.
 * @param {string} AttachmentUrl HTTP or HTTPS URL of a remote attachment.
 * @param {string} Filename Optional display filename for the remote attachment.
 * @param {string} Actions JSON array containing ntfy action button definitions.
 * @param {string} Delay Optional ntfy delivery delay, timestamp, or natural-language time.
 * @param {string} Email Optional email address, or yes to use the account's primary address.
 * @param {string} Call Optional phone number, or yes to use the account's primary number.
 * @param {string} SequenceId Optional sequence ID used to update an existing notification.
 * @param {('Global'|'Enabled'|'Disabled')} Cache Enable server-side caching or inherit Ntfy.Cache.
 * @param {('Global'|'Enabled'|'Disabled')} Firebase Enable Firebase forwarding or inherit Ntfy.Firebase.
 * @output Message sent
 * @output Message failed to send
 */
function Script(ServerUrl, Topic, Title, Message, Priority, Tags, Markdown, ClickUrl,
    IconUrl, AttachmentUrl, Filename, Actions, Delay, Email, Call, SequenceId, Cache, Firebase)
{
    var ntfy = new Ntfy({
        serverUrl: ServerUrl,
        topic: Topic
    });

    var sent = ntfy.sendMessage({
        title: Title,
        message: Message,
        priority: Priority,
        tags: Tags,
        markdown: Markdown,
        clickUrl: ClickUrl,
        iconUrl: IconUrl,
        attachmentUrl: AttachmentUrl,
        filename: Filename,
        actions: Actions,
        delay: Delay,
        email: Email,
        call: Call,
        sequenceId: SequenceId,
        cache: Cache,
        firebase: Firebase
    });

    return sent ? 1 : 2;
}
