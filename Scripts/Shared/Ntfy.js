/**
 * @name Ntfy
 * @uid f0cecb49-645e-4439-a538-9607d8cebe48
 * @author FileFlows Community
 * @revision 2
 * @minimumVersion 24.09.1.0
 * @description Client for publishing notifications to ntfy
 */
export function Ntfy(overrides, scope)
{
    this.Overrides = overrides || {};
    this.Scope = scope || '';
}

Ntfy.prototype.sendMessage = function(overrides, defaults)
{
    var request = null;
    var response = null;

    try
    {
        overrides = overrides || {};
        defaults = defaults || {};

        var serverUrl = this.firstValue(
            this.Overrides.serverUrl,
            this.getVariable('ServerUrl'),
            'https://ntfy.sh'
        );
        var topic = this.firstValue(
            this.Overrides.topic,
            this.getVariable('Topic'),
            null
        );

        serverUrl = this.validateServerUrl(serverUrl);
        topic = this.validateTopic(topic);

        var payload = { topic: topic };
        this.addString(payload, 'message', this.resolve('Message', overrides.message, defaults.message));
        this.addString(payload, 'title', this.resolve('Title', overrides.title, defaults.title));

        var priorityOverride = overrides.priority;
        if (typeof priorityOverride === 'string' && priorityOverride.trim().toLowerCase() === 'global')
        {
            priorityOverride = null;
        }
        var priority = this.resolve('Priority', priorityOverride, defaults.priority);
        if (this.hasValue(priority))
        {
            payload.priority = this.parsePriority(priority);
        }

        var tags = this.resolve('Tags', overrides.tags, defaults.tags);
        if (this.hasValue(tags))
        {
            payload.tags = this.parseTags(tags);
        }

        var markdown = this.resolveTriState('Markdown', overrides.markdown, defaults.markdown);
        if (markdown !== null)
        {
            payload.markdown = markdown;
        }

        this.addUri(payload, 'click', 'ClickUrl', overrides.clickUrl, defaults.clickUrl, false);
        this.addUri(payload, 'icon', 'IconUrl', overrides.iconUrl, defaults.iconUrl, true);
        this.addUri(payload, 'attach', 'AttachmentUrl', overrides.attachmentUrl, defaults.attachmentUrl, true);
        this.addString(payload, 'filename', this.resolve('Filename', overrides.filename, defaults.filename));
        this.addString(payload, 'delay', this.resolve('Delay', overrides.delay, defaults.delay));
        this.addString(payload, 'email', this.resolve('Email', overrides.email, defaults.email));
        this.addString(payload, 'call', this.resolve('Call', overrides.call, defaults.call));
        this.addString(payload, 'sequence_id', this.resolve('SequenceId', overrides.sequenceId, defaults.sequenceId));

        var actions = this.resolve('Actions', overrides.actions, defaults.actions);
        if (this.hasValue(actions))
        {
            payload.actions = this.parseActions(actions);
        }

        request = new System.Net.Http.HttpRequestMessage();
        request.Method = System.Net.Http.HttpMethod.Post;
        request.RequestUri = new System.Uri(serverUrl);
        request.Content = JsonContent(payload);

        this.addAuthentication(request);

        var cache = this.resolveTriState('Cache', overrides.cache, defaults.cache);
        if (cache !== null)
        {
            request.Headers.TryAddWithoutValidation('X-Cache', cache ? 'yes' : 'no');
        }

        var firebase = this.resolveTriState('Firebase', overrides.firebase, defaults.firebase);
        if (firebase !== null)
        {
            request.Headers.TryAddWithoutValidation('X-Firebase', firebase ? 'yes' : 'no');
        }

        response = http.SendAsync(request).Result;
        if (response.IsSuccessStatusCode)
        {
            return true;
        }

        var responseBody = response.Content.ReadAsStringAsync().Result;
        Logger.WLog('Error from ntfy (' + response.StatusCode + '): ' + responseBody);
        return false;
    }
    catch (error)
    {
        Logger.WLog('Error publishing to ntfy: ' + (error.message || error));
        return false;
    }
    finally
    {
        if (response)
        {
            response.Dispose();
        }
        if (request)
        {
            request.Dispose();
        }
    }
};

Ntfy.prototype.getVariable = function(name)
{
    if (this.Scope)
    {
        var scoped = Variables['Ntfy.' + this.Scope + '.' + name];
        if (this.hasValue(scoped))
        {
            return scoped;
        }
    }
    return Variables['Ntfy.' + name];
};

Ntfy.prototype.resolve = function(name, localValue, defaultValue)
{
    return this.firstValue(localValue, this.getVariable(name), defaultValue);
};

Ntfy.prototype.firstValue = function(first, second, third)
{
    if (this.hasValue(first))
    {
        return first;
    }
    if (this.hasValue(second))
    {
        return second;
    }
    if (this.hasValue(third))
    {
        return third;
    }
    return null;
};

Ntfy.prototype.hasValue = function(value)
{
    return value !== undefined && value !== null &&
        (typeof value !== 'string' || value.trim().length > 0);
};

Ntfy.prototype.addString = function(payload, property, value)
{
    if (this.hasValue(value))
    {
        payload[property] = '' + value;
    }
};

Ntfy.prototype.addUri = function(payload, property, variableName, localValue, defaultValue, httpOnly)
{
    var value = this.resolve(variableName, localValue, defaultValue);
    if (!this.hasValue(value))
    {
        return;
    }

    value = ('' + value).trim();
    var pattern = httpOnly
        ? /^https?:\/\/\S+$/i
        : /^[A-Za-z][A-Za-z0-9+.-]*:\S+$/;
    if (!pattern.test(value))
    {
        throw new Error(variableName + ' is not a valid absolute URI');
    }
    payload[property] = value;
};

Ntfy.prototype.validateServerUrl = function(value)
{
    value = ('' + value).trim();
    if (!/^https?:\/\/\S+$/i.test(value))
    {
        throw new Error('Ntfy.ServerUrl must be an absolute HTTP or HTTPS URL');
    }
    return value.replace(/\/+$/, '') + '/';
};

Ntfy.prototype.validateTopic = function(value)
{
    if (!this.hasValue(value))
    {
        throw new Error('Ntfy.Topic is required');
    }
    value = ('' + value).trim();
    if (!/^[-_A-Za-z0-9]{1,64}$/.test(value))
    {
        throw new Error('Ntfy.Topic may only contain letters, numbers, hyphens, and underscores, up to 64 characters');
    }
    return value;
};

Ntfy.prototype.parsePriority = function(value)
{
    var priorities = {
        min: 1,
        minimum: 1,
        low: 2,
        default: 3,
        normal: 3,
        high: 4,
        max: 5,
        maximum: 5,
        urgent: 5
    };
    var text = ('' + value).trim().toLowerCase();
    var priority = priorities[text] || parseInt(text, 10);
    if (priority < 1 || priority > 5 || isNaN(priority))
    {
        throw new Error('Ntfy.Priority must be between 1 and 5, or a supported priority name');
    }
    return priority;
};

Ntfy.prototype.parseTags = function(value)
{
    var source = Array.isArray(value) ? value : ('' + value).split(',');
    var result = [];
    for (var index = 0; index < source.length; index++)
    {
        var tag = ('' + source[index]).trim();
        if (tag.length > 0)
        {
            result.push(tag);
        }
    }
    return result;
};

Ntfy.prototype.parseActions = function(value)
{
    var actions = value;
    if (typeof actions === 'string')
    {
        try
        {
            actions = JSON.parse(actions);
        }
        catch (error)
        {
            throw new Error('Ntfy.Actions must be a valid JSON array');
        }
    }
    if (!Array.isArray(actions))
    {
        throw new Error('Ntfy.Actions must be a JSON array');
    }
    return actions;
};

Ntfy.prototype.resolveTriState = function(name, localValue, defaultValue)
{
    var value = localValue;
    if (typeof value === 'string' && value.trim().toLowerCase() === 'global')
    {
        value = null;
    }
    value = this.firstValue(value, this.getVariable(name), defaultValue);
    if (!this.hasValue(value))
    {
        return null;
    }
    if (typeof value === 'boolean')
    {
        return value;
    }

    var text = ('' + value).trim().toLowerCase();
    if (['true', 'yes', '1', 'enabled', 'enable'].indexOf(text) >= 0)
    {
        return true;
    }
    if (['false', 'no', '0', 'disabled', 'disable'].indexOf(text) >= 0)
    {
        return false;
    }
    throw new Error('Ntfy.' + name + ' must be Global, Enabled, or Disabled');
};

Ntfy.prototype.addAuthentication = function(request)
{
    var token = Variables['Ntfy.AccessToken'];
    var username = Variables['Ntfy.Username'];
    var password = Variables['Ntfy.Password'];

    if (this.hasValue(token) && (this.hasValue(username) || this.hasValue(password)))
    {
        throw new Error('Configure either Ntfy.AccessToken or Ntfy.Username/Ntfy.Password, not both');
    }

    if (this.hasValue(token))
    {
        request.Headers.TryAddWithoutValidation('Authorization', 'Bearer ' + token);
        return;
    }

    if (this.hasValue(username) !== this.hasValue(password))
    {
        throw new Error('Both Ntfy.Username and Ntfy.Password are required for basic authentication');
    }

    if (this.hasValue(username))
    {
        var credentials = System.Text.Encoding.UTF8.GetBytes(username + ':' + password);
        var encoded = System.Convert.ToBase64String(credentials);
        request.Headers.TryAddWithoutValidation('Authorization', 'Basic ' + encoded);
    }
};
