# FileFlows ntfy Scripts

JavaScript integration for publishing FileFlows notifications through [ntfy](https://ntfy.sh/).

## Included scripts

- `Scripts/Shared/Ntfy.js`: shared ntfy publishing client
- `Scripts/Flow/Notifications/Ntfy/Ntfy - Send Notification.js`: configurable flow node
- `Scripts/System/Notifications/Ntfy/`: file-processing and server-update event scripts

## Install in FileFlows

1. In **Configuration > Scripts**, create the shared script first and paste in `Scripts/Shared/Ntfy.js`.
2. Create the flow script and paste in `Scripts/Flow/Notifications/Ntfy/Ntfy - Send Notification.js`.
3. Optionally create the system scripts you want from `Scripts/System/Notifications/Ntfy/` and assign them to FileFlows tasks/events.
4. In **Configuration > Variables**, add at least:

   ```text
   Ntfy.Topic = your-private-topic
   ```

   The public ntfy service is used by default. To use another server or authentication, add:

   ```text
   Ntfy.ServerUrl = https://ntfy.sh
   Ntfy.AccessToken = tk_your_token
   ```

   Alternatively, use `Ntfy.Username` and `Ntfy.Password` instead of an access token.

## Global defaults

Optional global variables include:

```text
Ntfy.Title
Ntfy.Message
Ntfy.Priority
Ntfy.Tags
Ntfy.Markdown
Ntfy.ClickUrl
Ntfy.IconUrl
Ntfy.AttachmentUrl
Ntfy.Filename
Ntfy.Actions
Ntfy.Delay
Ntfy.Email
Ntfy.Call
Ntfy.SequenceId
Ntfy.Cache
Ntfy.Firebase
```

Non-empty values configured on the flow node override these global defaults.

## System-event overrides

System scripts support event-specific variables using these prefixes:

```text
Ntfy.FileProcessed.*
Ntfy.FileProcessingFailed.*
Ntfy.ServerUpdateAvailable.*
Ntfy.ServerUpdating.*
```

For example, `Ntfy.FileProcessingFailed.Topic` overrides `Ntfy.Topic` only for failed-file notifications.
