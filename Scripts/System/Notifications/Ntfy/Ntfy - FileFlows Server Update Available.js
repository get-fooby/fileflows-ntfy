/**
 * @name Ntfy - FileFlows Server Update Available
 * @uid 059519d0-74f0-40ad-9e30-a7e85d6f22a4
 * @description Sends an ntfy notification when a FileFlows server update is available
 * @author get-fooby
 * @revision 3
 * @minimumVersion 24.09.1.0
 * @help Requires Ntfy.Topic. Event-specific settings use the Ntfy.ServerUpdateAvailable prefix, for example Ntfy.ServerUpdateAvailable.Topic, Title, Message, or Priority.
 */

import { Ntfy } from '../../../Shared/Ntfy';

var version = Variables.Version;
if (!version)
{
    throw new Error('This script is expected to run with an update event');
}

var prefix = 'Ntfy.ServerUpdateAvailable.';
var ntfy = new Ntfy(Variables[prefix + 'ServerUrl'], Variables[prefix + 'Topic']);
ntfy.sendMessage(
    Variables[prefix + 'Title'] || Variables['Ntfy.Title'] || 'FileFlows Update Available',
    Variables[prefix + 'Message'] || Variables['Ntfy.Message'] ||
        'FileFlows Version ' + version + ' is now available',
    Variables[prefix + 'Priority'] || Variables['Ntfy.Priority']
);
