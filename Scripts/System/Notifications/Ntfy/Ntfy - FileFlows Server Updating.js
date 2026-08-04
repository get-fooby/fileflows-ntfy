/**
 * @name Ntfy - FileFlows Server Updating
 * @uid 0a610fc2-305c-49bd-8be1-846641400060
 * @description Sends an ntfy notification when the FileFlows server is being automatically updated
 * @author get-fooby
 * @revision 4
 * @minimumVersion 24.09.1.0
 * @help Requires Ntfy.Topic. Event-specific settings use the Ntfy.ServerUpdating prefix, for example Ntfy.ServerUpdating.Topic, Title, Message, or Priority.
 */

import { Ntfy } from '../../../Shared/Ntfy';

var version = Variables.Version;
if (!version)
{
    throw new Error('This script is expected to run with an update event');
}

var prefix = 'Ntfy.ServerUpdating.';
var ntfy = new Ntfy(Variables[prefix + 'Url'], Variables[prefix + 'Topic']);
ntfy.sendMessage(
    Variables[prefix + 'Title'] || Variables['Ntfy.Title'] || 'FileFlows Updating',
    Variables[prefix + 'Message'] || Variables['Ntfy.Message'] ||
        'FileFlows Version ' + version + ' is now being automatically installed',
    Variables[prefix + 'Priority'] || Variables['Ntfy.Priority']
);
