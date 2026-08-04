/**
 * @name Ntfy
 * @uid f0cecb49-645e-4439-a538-9607d8cebe48
 * @author get-fooby
 * @revision 4
 * @minimumVersion 24.09.1.0
 * @description Client for publishing notifications to ntfy
 */
export class Ntfy
{
    constructor(serverUrl, topic)
    {
        this.ServerUrl = serverUrl || Variables['Ntfy.ServerUrl'] || 'https://ntfy.sh';
        this.Topic = topic || Variables['Ntfy.Topic'];
        this.AccessToken = Variables['Ntfy.AccessToken'];
    }

    sendMessage(title, message, priority)
    {
        title = title || Variables['Ntfy.Title'];
        message = message || Variables['Ntfy.Message'];
        priority = priority === 'Global' ? null : priority;
        priority = priority || Variables['Ntfy.Priority'];

        var data = {
            topic: this.Topic,
            title: title,
            message: message
        };

        if (priority)
        {
            var priorities = {
                min: 1,
                low: 2,
                default: 3,
                high: 4,
                max: 5
            };
            data.priority = priorities[('' + priority).toLowerCase()] || parseInt(priority, 10);
        }

        var request = new System.Net.Http.HttpRequestMessage();
        request.Method = System.Net.Http.HttpMethod.Post;
        request.RequestUri = new System.Uri(('' + this.ServerUrl).replace(/\/+$/, '') + '/');
        request.Content = JsonContent(data);

        if (this.AccessToken)
        {
            request.Headers.TryAddWithoutValidation('Authorization', 'Bearer ' + this.AccessToken);
        }

        var response = http.SendAsync(request).Result;
        response.EnsureSuccessStatusCode();
        return true;
    }
}
