var settings = {}

// DB Settings
registerSetting('mongo.mongoConnectionUriBase', 'mongodb://localhost:27017/', 'MONGODB_URI_BASE', false)
registerSetting('mongo.dbName', 'alert-server', 'MONGODB_NAME', false);
registerSetting('mongo.mongoConnectionUriFull', settings.mongo.mongoConnectionUriBase + settings.mongo.dbName, 'MONGODB_URI', false);

// Server Settings
//registerSetting('server.port', '3000', 'PORT', false); // Not sure what "Normalize Port" does in main file, leaving this commented out for now.

// Route settings
registerSetting('routing.apiRoot', '/api', 'API_ROOT', false);

// Branding
registerSetting('branding.name', 'AlertServer', 'BRANDING_NAME', false);

// External dependencies
registerSetting('externalSites.ushahidi.uriBase', 'https://ushahidi-platform-test2017a.herokuapp.com', 'USHAHIDI_URI_BASE', false);

// registerSetting
//
// Registers a setting with our settings system.  Given a setting name, adds the default value to the 
// settings object exported by this file.  Additionally takes a name for an override parameter that
// can be set in the application's environment in order to override the default.  Finally, certain defaults,
// such as security keys, must be overridden in a production environment, and this function enforces that restriction.
function registerSetting(name, defaultValue, overrideName, fRequireOverrideInProduction) {
    const customOverrideValue = process.env[overrideName];
    const fIsProduction = process.env.NODE_ENV === 'production';
    if (customOverrideValue) {
        setNestedPropertyFromPropertyName(settings, name, customOverrideValue);
    }
    else {
        if (fIsProduction && fRequireOverrideInProduction) {
            throw new Error("Production-critical setting (" + name + ") not overridden in production environment.  Make sure process.env." + overrideName + " is set." )
        }
        setNestedPropertyFromPropertyName(settings, name, defaultValue);
    }
}

// setNestedPropertyFromPropertyName
//
// Given a '.'-separated nested property name, creates all sub-properties
// on the object before assigning the appropriate value.  E.g.
// setNestedPropertyFromPropertyName(myObj, foo.bar, baz) creates 
// myObj.foo, and then sets myObj.foo.bar = baz. 
function setNestedPropertyFromPropertyName(obj, name, value) {
    const pathElements = name.split('.');
    var target = obj;
    var nextPathElement = pathElements.shift()
    while (pathElements.length > 0) {
        if (!target[nextPathElement]) {
            target[nextPathElement] = {};
        }
        target = target[nextPathElement];
        nextPathElement = pathElements.shift()
    }
    target[nextPathElement] = value;
}

module.exports = settings;