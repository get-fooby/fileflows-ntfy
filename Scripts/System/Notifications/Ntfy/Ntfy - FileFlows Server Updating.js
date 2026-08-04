/**
 * @name Ntfy - FileFlows Server Updating
 * @uid 0a610fc2-305c-49bd-8be1-846641400060
 * @description Sends an ntfy notification when the FileFlows server is being automatically updated
 * @author FileFlows Community
 * @revision 1
 * @minimumVersion 24.09.1.0
 * @help Requires Ntfy.Topic. Event-specific settings use the Ntfy.ServerUpdating prefix, for example Ntfy.ServerUpdating.Topic, Title, Message, Priority, or Tags.
 */

import { Ntfy } from '../../../Shared/Ntfy';

let version = Variables.Version;
if (!version)
{
    Logger.WLog('This script is expected to run with an update event');
    return;
}

let ntfy = new Ntfy({}, 'ServerUpdating');
ntfy.sendMessage({}, {
    title: 'FileFlows Updating',
    message: `FileFlows Version ${version} is now being automatically installed`,
    tags: 'arrows_counterclockwise'
});
