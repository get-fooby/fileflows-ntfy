/**
 * @name Ntfy - Notify File Processing Failed
 * @uid f5595266-35ae-4fc5-86f3-4fb77fc792b3
 * @description Sends an ntfy notification when a file failed to be processed
 * @author FileFlows Community
 * @revision 2
 * @minimumVersion 24.09.1.0
 * @help Requires Ntfy.Topic. Event-specific settings use the Ntfy.FileProcessingFailed prefix, for example Ntfy.FileProcessingFailed.Topic, Title, Message, Priority, or Tags.
 */

import { Ntfy } from '../../../Shared/Ntfy';

var file = Variables.LibraryFile;
var library = Variables.Library;
if (!file || !library)
{
    Logger.WLog('This script is expected to run with a file event');
    return;
}

var ntfy = new Ntfy({}, 'FileProcessingFailed');
ntfy.sendMessage({}, {
    title: 'File Processing Failed',
    message: 'File failed to process ' + file.Name + '\nFrom Library ' + library.Name,
    tags: 'warning'
});
