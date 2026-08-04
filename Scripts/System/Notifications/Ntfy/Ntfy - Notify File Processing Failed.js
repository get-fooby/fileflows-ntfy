/**
 * Sends an ntfy notification when a file failed to be processed.
 *
 * @name Ntfy - Notify File Processing Failed
 * @uid f5595266-35ae-4fc5-86f3-4fb77fc792b3
 * @description Sends an ntfy notification when a file failed to be processed
 * @author get-fooby
 * @revision 7
 * @minimumVersion 24.09.1.0
 * @help Requires Ntfy.Topic. Event-specific settings use the Ntfy.FileProcessingFailed prefix, for example Ntfy.FileProcessingFailed.Topic, Title, Message, or Priority.
 */

import { Ntfy } from '../../../Shared/Ntfy';

var file = Variables.LibraryFile;
var library = Variables.Library;
if (!file || !library)
{
    throw new Error('This script is expected to run with a file event');
}

var prefix = 'Ntfy.FileProcessingFailed.';
var ntfy = new Ntfy(Variables[prefix + 'Url'], Variables[prefix + 'Topic']);
return ntfy.sendMessage(
    Variables[prefix + 'Title'] || Variables['Ntfy.Title'] || 'File Processing Failed',
    Variables[prefix + 'Message'] || Variables['Ntfy.Message'] ||
        'File failed to process ' + file.Name + '\nFrom Library ' + library.Name,
    Variables[prefix + 'Priority'] || Variables['Ntfy.Priority']
);
