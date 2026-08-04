/**
 * @name Ntfy
 * @uid f0cecb49-645e-4439-a538-9607d8cebe48
 * @author get-fooby
 * @revision 5
 * @minimumVersion 24.09.1.0
 * @description Client for publishing notifications to ntfy
 */
export class Ntfy
{
    constructor(URL, Topic)
    {
        this.URL = URL || Variables['Ntfy.Url'] || 'https://ntfy.sh';
        this.Topic = Topic || Variables['Ntfy.Topic'];
        this.AccessToken = Variables['Ntfy.AccessToken'];

        if (!this.Topic)
            MissingVariable('Ntfy.Topic');
    }

    getUrl()
    {
        var url = '' + this.URL;
        if (url.endsWith('/') === false)
            url += '/';
        return url;
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

        if (this.AccessToken)
            http.DefaultRequestHeaders.Add('Authorization', 'Bearer ' + this.AccessToken);

        var response = http.PostAsync(this.getUrl(), JsonContent(data)).Result;

        if (this.AccessToken)
            http.DefaultRequestHeaders.Remove('Authorization');

        if (response.IsSuccessStatusCode)
            return true;

        var error = response.Content.ReadAsStringAsync().Result;
        Logger.WLog('Error from ntfy: ' + error);
        return false;
    }
}
