/**
 * @name Ntfy - Notify File Processed
 * @uid e5d457e7-056e-4ce9-bbc7-48a171738cc2
 * @description Sends an ntfy notification when a file has been successfully processed
 * @author get-fooby
 * @revision 4
 * @minimumVersion 24.09.1.0
 * @help Requires Ntfy.Topic. Event-specific settings use the Ntfy.FileProcessed prefix, for example Ntfy.FileProcessed.Topic, Title, Message, or Priority.
 */

import { Ntfy } from '../../../Shared/Ntfy';

var file = Variables.LibraryFile;
var library = Variables.Library;
if (!file || !library)
{
    throw new Error('This script is expected to run with a file event');
}

var prefix = 'Ntfy.FileProcessed.';
var ntfy = new Ntfy(Variables[prefix + 'Url'], Variables[prefix + 'Topic']);
ntfy.sendMessage(
    Variables[prefix + 'Title'] || Variables['Ntfy.Title'] || 'File Processed',
    Variables[prefix + 'Message'] || Variables['Ntfy.Message'] ||
        'File processed ' + file.Name + '\nFrom Library ' + library.Name,
    Variables[prefix + 'Priority'] || Variables['Ntfy.Priority']
);
