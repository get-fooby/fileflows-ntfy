/**
 * @name Ntfy - Notify File Processed
 * @uid e5d457e7-056e-4ce9-bbc7-48a171738cc2
 * @description Sends an ntfy notification when a file has been successfully processed
 * @author FileFlows Community
 * @revision 1
 * @minimumVersion 24.09.1.0
 * @help Requires Ntfy.Topic. Event-specific settings use the Ntfy.FileProcessed prefix, for example Ntfy.FileProcessed.Topic, Title, Message, Priority, or Tags.
 */

import { Ntfy } from '../../../Shared/Ntfy';

let file = Variables.LibraryFile;
let library = Variables.Library;
if (!file || !library)
{
    Logger.WLog('This script is expected to run with a file event');
    return;
}

let ntfy = new Ntfy({}, 'FileProcessed');
ntfy.sendMessage({}, {
    title: 'File Processed',
    message: `File processed ${file.Name}\nFrom Library ${library.Name}`,
    tags: 'heavy_check_mark'
});
