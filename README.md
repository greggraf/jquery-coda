CODA jQuery Plugin
==================

Introduction
------------

This plugin is written to help with the integration of Ads into the page, and is specifically focussed on providing for loading ads in iframes in an unobtrusive way. This plugin may evolve to support other CODA integration such as: reporting calls, automatic search related reporting, link events, trusted javascript ad calls (without document.write() statements).

Version 0.2.0
---------------
* Source: <http://btg.mtvnservices.com/mtvn/jquery-coda/0.2.0/coda.js>
* Minfied: <http://btg.mtvnservices.com/mtvn/jquery-coda/0.2.0/coda.min.js>
* Dependancies: jQuery (1.4.4 or later), CODA

Changes
-----------
* support for data attributes that will be used in the Dart For Publishers integration.

How It Works
------------

There are two parts:

1. **Placeholders**: Dom elements with `data-` attributes in the HTML markup
2.	Plugin Invocation

When invoked against a jQuery collection of the Placeholders, the plugin will:

1.	Confirm that CODA is on the page, or exit.
2.	Loop through each placeholder element, extract its data- attributes.
3.	Prepare an iframe ad call url (adi) using the btg.Controller.getAdUrl() method
4.	Construct Iframes with the iframe ad url and append them to the placeholders in the document

###Placeholders###

The plugin supports the following data attributes to mirror the data attributes that CODA will be looking for after the switch to Dart For Publishers.  The plugin will map them to the corresponding ad object properties.  In this the placeholders divs should not have to change when the switch to Dart For Publishers happens.
* `data-ad-sizes` - A string indicating the size of the ad used in the dart call. for example "728x90".  Maps to `data-sz` --> `adObj.size`.
* `data-ad-unit` - A string indicating the zone. Maps to `data-zone` --> `adObj.zoneOverride`.
* `data-ad-keyvalues` - A string indicating the keyvalues. Maps to `adObj.keyValues`.


Previous data attributes that are still supported are:
* `data-sz` - A string indicating the size of the ad used in the dart call. for example "728x90"
* `data-addkv` - A semicolon delimited string of key/value pairs to be added to any existing page level key/values that may have been set in btg.config.DoubleClick.keyValues, to be used in the DART call for targetting ads.
* `data-replacekv` - A semicolon delimited string of key/value pairs that replace any existing key/values that are already set in btg.config.DoubleClick.keyValues, to be used in the DART call for targetting ads.
Using data-addkv and data-replacekv in the same element will first apply the data-replacekv, then add the data-addkv
* `data-zone` - A string that defines the zone to be used in the DART call.
* `data-refreshRate` - A number representing the seconds after which the ad should be refreshed. 

The plugin will check for this on each refresh, so you could cancel and initiate reloading programatically by doing something like this:
    
    $(element).data("refreshrate", false); // to cancel
    
    $(element).data("refreshrate", 60);    // to intiate at a sixty second refresh

For Example:
    
    // Placeholder for the basic 728x90 banner ad call
    <div class="mtvn_ad" data-sz="728x90"></div>                
    
    // Placeholder for a 300x250 ad call on a 30 second refresh
    <div class="mtvn_ad" data-sz="300x250" data-refreshrate="30" ></div>
		
###Plugin and Invocation###
The plugin can be referenced at the BTG server, at this url: <http://btg.mtvnservices.com/mtvn/jquery-coda/0.2.0/coda.js> or <http://btg.mtvnservices.com/mtvn/jquery-coda/0.2.0/coda.min.js>

The plugin is invoked by calling sm4() on a collection of jQuery elements. Using the markup defined above, the call would look like this:

    $(".mtvn_ads").coda();

###Custom Events###
The Plugin exposes the following jQuery custom events:

**coda:ad:load** _(event, object)_
Triggered on each placeholder element, after an ad has been loaded in. This is not the Iframe load event, and will fier after the iframe has been appended to the DOM, but might happen before the ad itself has loaded. An object is passed that has an url property which corresponds to the src attribute of the iframe.