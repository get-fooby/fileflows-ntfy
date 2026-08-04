/**
 * @name Ntfy - FileFlows Server Update Available
 * @uid 059519d0-74f0-40ad-9e30-a7e85d6f22a4
 * @description Sends an ntfy notification when a FileFlows server update is available
 * @author FileFlows Community
 * @revision 2
 * @minimumVersion 24.09.1.0
 * @help Requires Ntfy.Topic. Event-specific settings use the Ntfy.ServerUpdateAvailable prefix, for example Ntfy.ServerUpdateAvailable.Topic, Title, Message, Priority, or Tags.
 */

import { Ntfy } from '../../../Shared/Ntfy';

var version = Variables.Version;
if (!version)
{
    Logger.WLog('This script is expected to run with an update event');
    return;
}

var ntfy = new Ntfy({}, 'ServerUpdateAvailable');
ntfy.sendMessage({}, {
    title: 'FileFlows Update Available',
    message: 'FileFlows Version ' + version + ' is now available',
    tags: 'loudspeaker'
});
