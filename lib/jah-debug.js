//=============================================================================
// Copyright © Jason Heddings, All Rights Reserved
// $Id: debug.js 1 2011-02-05 16:58:05Z jheddings $
//=============================================================================

// XXX should this use the GM_log function instead?
// TODO need to use 'prefix' when printing messages

//////////////////////////////////////////////////////////////////////////////////
var debug = {
  enabled: false,
  prefix: undefined,

  //----------------------------------------------------------------------------
  print: function(msg) {
    if ((this.enabled) && (unsafeWindow.console) && (unsafeWindow.console.log)) {
      unsafeWindow.console.log(msg);
    }
  },

  //----------------------------------------------------------------------------
  log: function(msg) {
    if ((this.enabled) && (unsafeWindow.console) && (unsafeWindow.console.log)) {
      unsafeWindow.console.log('jah.debug: ', msg);
    }
  },

  //----------------------------------------------------------------------------
  info: function(msg) {
    if ((this.enabled) && (unsafeWindow.console) && (unsafeWindow.console.info)) {
      unsafeWindow.console.info('jah.debug: ', msg);
    }
  },

  //----------------------------------------------------------------------------
  warn: function(msg) {
    if ((this.enabled) && (unsafeWindow.console) && (unsafeWindow.console.warn)) {
      unsafeWindow.console.warn('jah.debug: ', msg);
    }
  },

  //----------------------------------------------------------------------------
  error: function(msg) {
    if ((this.enabled) && (unsafeWindow.console) && (unsafeWindow.console.error)) {
      unsafeWindow.console.error('jah.debug: ', msg);
    }
  },

  //----------------------------------------------------------------------------
  group: function(title) {
    if ((this.enabled) && (unsafeWindow.console) && (unsafeWindow.console.group)) {
      unsafeWindow.console.group('jah.debug: ', title);
    }
  },

  //----------------------------------------------------------------------------
  ungroup: function() {
    if ((this.enabled) && (unsafeWindow.console) && (unsafeWindow.console.groupEnd)) {
      unsafeWindow.console.groupEnd();
    }
  },
};
