(function() {
    if (typeof _widget_options == "undefined") _widget_options = {};
    if (typeof _widget_options.iframe_base_path == "undefined") _widget_options.iframe_base_path = 'http://widget.safetyauth.com/contact';
    // if (typeof _widget_options.animation == "undefined") _widget_options.animation = 'main';
    // if (typeof _widget_options.delay == "undefined") _widget_options.delay = 1000;
    if (typeof _widget_options.debug == "undefined") _widget_options.debug = false;
    // if (typeof _widget_options.date == "undefined") _widget_options.date = new Date(2017, 11 /* Zero-based month */, 14);
    // if (typeof _widget_options.viewCookieExpires == "undefined") _widget_options.viewCookieExpires = 1;
    // if (typeof _widget_options.actionCookieExpires == "undefined") _widget_options.actionCookieExpires = 7;
    // if (typeof _widget_options.always_show_widget == "undefined") _widget_options.always_show_widget = false;
    if (typeof _widget_options.theme == "undefined") _widget_options.theme = 'capitol';
  
    var _bftn_animations = {
      main: {
        options: {
          modalAnimation: 'main'
        },
        init: function(options) {
          var keys = Object.keys(options);
          for (var k = 0; k < keys.length; k++) {
            this.options[keys[k]] = options[keys[k]];
          }
  
          return this;
        },
        start: function() {
          var iframe = _widget_util.createIframe();
          _widget_util.bindIframeCommunicator(document.getElementById('_bftn_iframe'), this);
        },
        stop: function() {
          _widget_util.destroyIframe();
        }
      }
    }
  
    var _widget_util = {
      injectCSS: function(id, css) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.id = id;
        if (style.styleSheet) style.styleSheet.cssText = css;
        else style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
      },
  
      createIframe: function() {
        var wrapper = document.createElement('div');
        wrapper.id = '_bftn_wrapper';
        var iframe = document.createElement('iframe');
        iframe.id = '_bftn_iframe';
        iframe.src = _widget_options.iframe_base_path + '/iframe.html';
        iframe.frameBorder = 0;
        iframe.allowTransparency = true; 
        iframe.style.display = 'none';
        wrapper.appendChild(iframe);
        document.body.appendChild(wrapper);
        return wrapper;
      },
  
      destroyIframe: function() {
        var iframe = document.getElementById('_bftn_wrapper');
        iframe.parentNode.removeChild(iframe);
      },
  
      bindIframeCommunicator: function(iframe, animation) {
        function sendMessage(requestType, data) {
          data || (data = {});
          data.requestType = requestType;
          data.BFTN_WIDGET_MSG = true;
          iframe.contentWindow.postMessage(data, '*');
        }
  
        var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
        var eventer = window[eventMethod];
        var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";
  
        eventer(messageEvent, function(e) {
          if (!e.data || !e.data.BFTN_IFRAME_MSG) return;
  
          delete e.data.BFTN_IFRAME_MSG;
  
          switch (e.data.requestType) {
            case 'getAnimation':
              iframe.style.display = 'block';
              sendMessage('putAnimation', animation.options);
              break;
            case 'stop':
              animation.stop();
              break;
            case 'cookie':
              _widget_util.setCookie(e.data.name, e.data.val, e.data.expires);
              break;
          }
        }, false);
      },
  
      setCookie: function(name, val, exdays) {
        var d = new Date();
        d.setTime(d.getTime()+(exdays*24*60*60*1000));
  
        var expires = "expires="+d.toGMTString();
        document.cookie = name + "=" + val + "; " + expires + "; path=/";
      },
  
      getCookie: function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        var c;
  
        for(var i = 0; i < ca.length; i++) {
          c = ca[i].trim();
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
  
        return "";
      },
  
      log: function() {
        if (_widget_options.debug) console.log.apply(console, arguments);
      }
    }
  
    function onDomContentLoaded() {
      var images = new Array();
      var preloaded = 0;
  
      function init() {
        setTimeout(function() {
          _bftn_animations[_widget_options.animation].init(_widget_options).start();
        }, _widget_options.delay);
      }
  
      function preload() {
        for (i = 0; i < preload.arguments.length; i++) {
          images[i] = new Image()
          images[i].src = _widget_options.iframe_base_path + '/images/' + preload.arguments[i]
  
          images[i].onload = function() {
            preloaded++;
            _widget_util.log('Preloaded ' + preloaded + ' images.');
  
            if (preloaded == images.length) {
              _widget_util.log('DONE PRELOADING IMAGES. Starting animation in ' + _widget_options.delay + ' milliseconds.');
              init();
            }
          }
        }
      }
  
      // Should we show the widget, regardless?
      // if (!_widget_options.always_show_widget && window.location.href.indexOf('ALWAYS_SHOW_BFTN_WIDGET') === -1) {
  
      //   // Don't show widget if cookie has been set.
      //   if (
      //     _widget_util.getCookie('_BFTN_WIDGET_VIEW') ||
      //     _widget_util.getCookie('_BFTN_WIDGET_ACTION')
      //   ) {
      //     return;
      //   }
      // }
  
      // Only show once per day.
      // _widget_util.setCookie('_BFTN_WIDGET_VIEW', 'true', _widget_options.viewCookieExpires);
  
      // _widget_util.injectCSS('_bftn_iframe_css', '#_bftn_wrapper { position: fixed; left: 0px; top: 0px; width: 100%; height: 100%; z-index: 20000; -webkit-overflow-scrolling: touch; overflow-y: auto; } #_bftn_iframe { width: 100%; height: 100%;  }');
  
      init();
    }
  
    // Wait for DOM content to load.
    switch(document.readyState) {
      case 'complete':
      case 'loaded':
      case 'interactive':
        onDomContentLoaded();
        break;
      default:
        if (typeof document.addEventListener === 'function') {
          document.addEventListener('DOMContentLoaded', onDomContentLoaded, false);
        }
    }
  })();