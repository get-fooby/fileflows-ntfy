/**
 * @name Ntfy
 * @uid f0cecb49-645e-4439-a538-9607d8cebe48
 * @author FileFlows Community
 * @revision 1
 * @minimumVersion 24.09.1.0
 * @description Client for publishing notifications to ntfy
 */
export class Ntfy
{
    constructor(overrides, scope)
    {
        this.Overrides = overrides || {};
        this.Scope = scope || '';
    }

    /**
     * Publishes a notification.
     * Values are resolved in this order: local override, event-scoped variable,
     * global Ntfy variable, built-in default.
     *
     * @param {object} overrides local notification overrides
     * @param {object} defaults built-in defaults used by event scripts
     * @returns {bool} true when ntfy accepted the notification
     */
    sendMessage(overrides, defaults)
    {
        let request = null;
        let response = null;

        try
        {
            overrides = overrides || {};
            defaults = defaults || {};

            let serverUrl = this.pick(
                this.Overrides.serverUrl,
                this.getVariable('ServerUrl'),
                'https://ntfy.sh'
            );
            let topic = this.pick(
                this.Overrides.topic,
                this.getVariable('Topic')
            );

            serverUrl = this.validateServerUrl(serverUrl);
            topic = this.validateTopic(topic);

            let payload = { topic: topic };
            this.addString(payload, 'message', this.resolve('Message', overrides.message, defaults.message));
            this.addString(payload, 'title', this.resolve('Title', overrides.title, defaults.title));

            let priorityOverride = overrides.priority;
            if (typeof priorityOverride === 'string' && priorityOverride.trim().toLowerCase() === 'global')
                priorityOverride = null;
            let priority = this.resolve('Priority', priorityOverride, defaults.priority);
            if (this.hasValue(priority))
                payload.priority = this.parsePriority(priority);

            let tags = this.resolve('Tags', overrides.tags, defaults.tags);
            if (this.hasValue(tags))
                payload.tags = this.parseTags(tags);

            let markdown = this.resolveTriState('Markdown', overrides.markdown, defaults.markdown);
            if (markdown !== null)
                payload.markdown = markdown;

            this.addUri(payload, 'click', 'ClickUrl', overrides.clickUrl, defaults.clickUrl, false);
            this.addUri(payload, 'icon', 'IconUrl', overrides.iconUrl, defaults.iconUrl, true);
            this.addUri(payload, 'attach', 'AttachmentUrl', overrides.attachmentUrl, defaults.attachmentUrl, true);
            this.addString(payload, 'filename', this.resolve('Filename', overrides.filename, defaults.filename));
            this.addString(payload, 'delay', this.resolve('Delay', overrides.delay, defaults.delay));
            this.addString(payload, 'email', this.resolve('Email', overrides.email, defaults.email));
            this.addString(payload, 'call', this.resolve('Call', overrides.call, defaults.call));
            this.addString(payload, 'sequence_id', this.resolve('SequenceId', overrides.sequenceId, defaults.sequenceId));

            let actions = this.resolve('Actions', overrides.actions, defaults.actions);
            if (this.hasValue(actions))
                payload.actions = this.parseActions(actions);

            request = new System.Net.Http.HttpRequestMessage();
            request.Method = System.Net.Http.HttpMethod.Post;
            request.RequestUri = new System.Uri(serverUrl);
            request.Content = JsonContent(payload);

            this.addAuthentication(request);

            let cache = this.resolveTriState('Cache', overrides.cache, defaults.cache);
            if (cache !== null)
                request.Headers.TryAddWithoutValidation('X-Cache', cache ? 'yes' : 'no');

            let firebase = this.resolveTriState('Firebase', overrides.firebase, defaults.firebase);
            if (firebase !== null)
                request.Headers.TryAddWithoutValidation('X-Firebase', firebase ? 'yes' : 'no');

            response = http.SendAsync(request).Result;
            if (response.IsSuccessStatusCode)
                return true;

            let error = response.Content.ReadAsStringAsync().Result;
            Logger?.WLog(`Error from ntfy (${response.StatusCode}): ${error}`);
            return false;
        }
        catch (error)
        {
            Logger?.WLog('Error publishing to ntfy: ' + (error?.message || error));
            return false;
        }
        finally
        {
            response?.Dispose();
            request?.Dispose();
        }
    }

    getVariable(name)
    {
        if (this.Scope)
        {
            let scoped = Variables[`Ntfy.${this.Scope}.${name}`];
            if (this.hasValue(scoped))
                return scoped;
        }
        return Variables[`Ntfy.${name}`];
    }

    resolve(name, localValue, defaultValue)
    {
        return this.pick(localValue, this.getVariable(name), defaultValue);
    }

    pick()
    {
        for (let index = 0; index < arguments.length; index++)
        {
            let value = arguments[index];
            if (this.hasValue(value))
                return value;
        }
        return null;
    }

    hasValue(value)
    {
        return value !== undefined && value !== null &&
            (typeof value !== 'string' || value.trim().length > 0);
    }

    addString(payload, property, value)
    {
        if (this.hasValue(value))
            payload[property] = '' + value;
    }

    addUri(payload, property, variableName, localValue, defaultValue, httpOnly)
    {
        let value = this.resolve(variableName, localValue, defaultValue);
        if (!this.hasValue(value))
            return;

        value = ('' + value).trim();
        let pattern = httpOnly
            ? /^https?:\/\/\S+$/i
            : /^[A-Za-z][A-Za-z0-9+.-]*:\S+$/;
        if (!pattern.test(value))
            throw new Error(`${variableName} is not a valid absolute URI`);
        payload[property] = value;
    }

    validateServerUrl(value)
    {
        value = ('' + value).trim();
        if (!/^https?:\/\/\S+$/i.test(value))
            throw new Error('Ntfy.ServerUrl must be an absolute HTTP or HTTPS URL');
        return value.replace(/\/+$/, '') + '/';
    }

    validateTopic(value)
    {
        if (!this.hasValue(value))
            throw new Error('Ntfy.Topic is required');
        value = ('' + value).trim();
        if (!/^[-_A-Za-z0-9]{1,64}$/.test(value))
            throw new Error('Ntfy.Topic may only contain letters, numbers, hyphens, and underscores, up to 64 characters');
        return value;
    }

    parsePriority(value)
    {
        let priorities = {
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
        let text = ('' + value).trim().toLowerCase();
        let priority = priorities[text] || parseInt(text);
        if (priority < 1 || priority > 5 || isNaN(priority))
            throw new Error('Ntfy.Priority must be between 1 and 5, or a supported priority name');
        return priority;
    }

    parseTags(value)
    {
        if (Array.isArray(value))
            return value.map(x => ('' + x).trim()).filter(x => x.length > 0);
        return ('' + value).split(',').map(x => x.trim()).filter(x => x.length > 0);
    }

    parseActions(value)
    {
        let actions = value;
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
            throw new Error('Ntfy.Actions must be a JSON array');
        return actions;
    }

    resolveTriState(name, localValue, defaultValue)
    {
        let value = localValue;
        if (typeof value === 'string' && value.trim().toLowerCase() === 'global')
            value = null;
        value = this.pick(value, this.getVariable(name), defaultValue);
        if (!this.hasValue(value))
            return null;
        if (typeof value === 'boolean')
            return value;

        let text = ('' + value).trim().toLowerCase();
        if (['true', 'yes', '1', 'enabled', 'enable'].includes(text))
            return true;
        if (['false', 'no', '0', 'disabled', 'disable'].includes(text))
            return false;
        throw new Error(`Ntfy.${name} must be Global, Enabled, or Disabled`);
    }

    addAuthentication(request)
    {
        let token = Variables['Ntfy.AccessToken'];
        let username = Variables['Ntfy.Username'];
        let password = Variables['Ntfy.Password'];

        if (this.hasValue(token) && (this.hasValue(username) || this.hasValue(password)))
            throw new Error('Configure either Ntfy.AccessToken or Ntfy.Username/Ntfy.Password, not both');

        if (this.hasValue(token))
        {
            request.Headers.TryAddWithoutValidation('Authorization', 'Bearer ' + token);
            return;
        }

        if (this.hasValue(username) !== this.hasValue(password))
            throw new Error('Both Ntfy.Username and Ntfy.Password are required for basic authentication');

        if (this.hasValue(username))
        {
            let credentials = System.Text.Encoding.UTF8.GetBytes(username + ':' + password);
            let encoded = System.Convert.ToBase64String(credentials);
            request.Headers.TryAddWithoutValidation('Authorization', 'Basic ' + encoded);
        }
    }
}
