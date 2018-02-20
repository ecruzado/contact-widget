/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(3);
module.exports = __webpack_require__(4);


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/*!
 * Validator v0.11.5 for Bootstrap 3, by @1000hz
 * Copyright 2016 Cina Saffary
 * Licensed under http://opensource.org/licenses/MIT
 *
 * https://github.com/1000hz/bootstrap-validator
 */

+function ($) {
  'use strict';

  // VALIDATOR CLASS DEFINITION
  // ==========================

  function getValue($el) {
    return $el.is('[type="checkbox"]') ? $el.prop('checked')                                     :
           $el.is('[type="radio"]')    ? !!$('[name="' + $el.attr('name') + '"]:checked').length :
                                         $el.val()
  }

  var Validator = function (element, options) {
    this.options    = options
    this.validators = $.extend({}, Validator.VALIDATORS, options.custom)
    this.$element   = $(element)
    this.$btn       = $('button[type="submit"], input[type="submit"]')
                        .filter('[form="' + this.$element.attr('id') + '"]')
                        .add(this.$element.find('input[type="submit"], button[type="submit"]'))

    this.update()

    this.$element.on('input.bs.validator change.bs.validator focusout.bs.validator', $.proxy(this.onInput, this))
    this.$element.on('submit.bs.validator', $.proxy(this.onSubmit, this))
    this.$element.on('reset.bs.validator', $.proxy(this.reset, this))

    this.$element.find('[data-match]').each(function () {
      var $this  = $(this)
      var target = $this.data('match')

      $(target).on('input.bs.validator', function (e) {
        getValue($this) && $this.trigger('input.bs.validator')
      })
    })

    this.$inputs.filter(function () { return getValue($(this)) }).trigger('focusout')

    this.$element.attr('novalidate', true) // disable automatic native validation
    this.toggleSubmit()
  }

  Validator.VERSION = '0.11.5'

  Validator.INPUT_SELECTOR = ':input:not([type="hidden"], [type="submit"], [type="reset"], button)'

  Validator.FOCUS_OFFSET = 20

  Validator.DEFAULTS = {
    delay: 500,
    html: false,
    disable: true,
    focus: true,
    custom: {},
    errors: {
      match: 'Does not match',
      minlength: 'Not long enough'
    },
    feedback: {
      success: 'glyphicon-ok',
      error: 'glyphicon-remove'
    }
  }

  Validator.VALIDATORS = {
    'native': function ($el) {
      var el = $el[0]
      if (el.checkValidity) {
        return !el.checkValidity() && !el.validity.valid && (el.validationMessage || "error!")
      }
    },
    'match': function ($el) {
      var target = $el.data('match')
      return $el.val() !== $(target).val() && Validator.DEFAULTS.errors.match
    },
    'minlength': function ($el) {
      var minlength = $el.data('minlength')
      return $el.val().length < minlength && Validator.DEFAULTS.errors.minlength
    }
  }

  Validator.prototype.update = function () {
    this.$inputs = this.$element.find(Validator.INPUT_SELECTOR)
      .add(this.$element.find('[data-validate="true"]'))
      .not(this.$element.find('[data-validate="false"]'))

    return this
  }

  Validator.prototype.onInput = function (e) {
    var self        = this
    var $el         = $(e.target)
    var deferErrors = e.type !== 'focusout'

    if (!this.$inputs.is($el)) return

    this.validateInput($el, deferErrors).done(function () {
      self.toggleSubmit()
    })
  }

  Validator.prototype.validateInput = function ($el, deferErrors) {
    var value      = getValue($el)
    var prevErrors = $el.data('bs.validator.errors')
    var errors

    if ($el.is('[type="radio"]')) $el = this.$element.find('input[name="' + $el.attr('name') + '"]')

    var e = $.Event('validate.bs.validator', {relatedTarget: $el[0]})
    this.$element.trigger(e)
    if (e.isDefaultPrevented()) return

    var self = this

    return this.runValidators($el).done(function (errors) {
      $el.data('bs.validator.errors', errors)

      errors.length
        ? deferErrors ? self.defer($el, self.showErrors) : self.showErrors($el)
        : self.clearErrors($el)

      if (!prevErrors || errors.toString() !== prevErrors.toString()) {
        e = errors.length
          ? $.Event('invalid.bs.validator', {relatedTarget: $el[0], detail: errors})
          : $.Event('valid.bs.validator', {relatedTarget: $el[0], detail: prevErrors})

        self.$element.trigger(e)
      }

      self.toggleSubmit()

      self.$element.trigger($.Event('validated.bs.validator', {relatedTarget: $el[0]}))
    })
  }


  Validator.prototype.runValidators = function ($el) {
    var errors   = []
    var deferred = $.Deferred()

    $el.data('bs.validator.deferred') && $el.data('bs.validator.deferred').reject()
    $el.data('bs.validator.deferred', deferred)

    function getValidatorSpecificError(key) {
      return $el.data(key + '-error')
    }

    function getValidityStateError() {
      var validity = $el[0].validity
      return validity.typeMismatch    ? $el.data('type-error')
           : validity.patternMismatch ? $el.data('pattern-error')
           : validity.stepMismatch    ? $el.data('step-error')
           : validity.rangeOverflow   ? $el.data('max-error')
           : validity.rangeUnderflow  ? $el.data('min-error')
           : validity.valueMissing    ? $el.data('required-error')
           :                            null
    }

    function getGenericError() {
      return $el.data('error')
    }

    function getErrorMessage(key) {
      return getValidatorSpecificError(key)
          || getValidityStateError()
          || getGenericError()
    }

    $.each(this.validators, $.proxy(function (key, validator) {
      var error = null
      if ((getValue($el) || $el.attr('required')) &&
          ($el.data(key) || key == 'native') &&
          (error = validator.call(this, $el))) {
         error = getErrorMessage(key) || error
        !~errors.indexOf(error) && errors.push(error)
      }
    }, this))

    if (!errors.length && getValue($el) && $el.data('remote')) {
      this.defer($el, function () {
        var data = {}
        data[$el.attr('name')] = getValue($el)
        $.get($el.data('remote'), data)
          .fail(function (jqXHR, textStatus, error) { errors.push(getErrorMessage('remote') || error) })
          .always(function () { deferred.resolve(errors)})
      })
    } else deferred.resolve(errors)

    return deferred.promise()
  }

  Validator.prototype.validate = function () {
    var self = this

    $.when(this.$inputs.map(function (el) {
      return self.validateInput($(this), false)
    })).then(function () {
      self.toggleSubmit()
      self.focusError()
    })

    return this
  }

  Validator.prototype.focusError = function () {
    if (!this.options.focus) return

    var $input = this.$element.find(".has-error:first :input")
    if ($input.length === 0) return

    $('html, body').animate({scrollTop: $input.offset().top - Validator.FOCUS_OFFSET}, 250)
    $input.focus()
  }

  Validator.prototype.showErrors = function ($el) {
    var method = this.options.html ? 'html' : 'text'
    var errors = $el.data('bs.validator.errors')
    var $group = $el.closest('.form-group')
    var $block = $group.find('.help-block.with-errors')
    var $feedback = $group.find('.form-control-feedback')

    if (!errors.length) return

    errors = $('<ul/>')
      .addClass('list-unstyled')
      .append($.map(errors, function (error) { return $('<li/>')[method](error) }))

    $block.data('bs.validator.originalContent') === undefined && $block.data('bs.validator.originalContent', $block.html())
    $block.empty().append(errors)
    $group.addClass('has-error has-danger')

    $group.hasClass('has-feedback')
      && $feedback.removeClass(this.options.feedback.success)
      && $feedback.addClass(this.options.feedback.error)
      && $group.removeClass('has-success')
  }

  Validator.prototype.clearErrors = function ($el) {
    var $group = $el.closest('.form-group')
    var $block = $group.find('.help-block.with-errors')
    var $feedback = $group.find('.form-control-feedback')

    $block.html($block.data('bs.validator.originalContent'))
    $group.removeClass('has-error has-danger has-success')

    $group.hasClass('has-feedback')
      && $feedback.removeClass(this.options.feedback.error)
      && $feedback.removeClass(this.options.feedback.success)
      && getValue($el)
      && $feedback.addClass(this.options.feedback.success)
      && $group.addClass('has-success')
  }

  Validator.prototype.hasErrors = function () {
    function fieldErrors() {
      return !!($(this).data('bs.validator.errors') || []).length
    }

    return !!this.$inputs.filter(fieldErrors).length
  }

  Validator.prototype.isIncomplete = function () {
    function fieldIncomplete() {
      var value = getValue($(this))
      return !(typeof value == "string" ? $.trim(value) : value)
    }

    return !!this.$inputs.filter('[required]').filter(fieldIncomplete).length
  }

  Validator.prototype.onSubmit = function (e) {
    this.validate()
    if (this.isIncomplete() || this.hasErrors()) e.preventDefault()
  }

  Validator.prototype.toggleSubmit = function () {
    if (!this.options.disable) return
    this.$btn.toggleClass('disabled', this.isIncomplete() || this.hasErrors())
  }

  Validator.prototype.defer = function ($el, callback) {
    callback = $.proxy(callback, this, $el)
    if (!this.options.delay) return callback()
    window.clearTimeout($el.data('bs.validator.timeout'))
    $el.data('bs.validator.timeout', window.setTimeout(callback, this.options.delay))
  }

  Validator.prototype.reset = function () {
    this.$element.find('.form-control-feedback')
      .removeClass(this.options.feedback.error)
      .removeClass(this.options.feedback.success)

    this.$inputs
      .removeData(['bs.validator.errors', 'bs.validator.deferred'])
      .each(function () {
        var $this = $(this)
        var timeout = $this.data('bs.validator.timeout')
        window.clearTimeout(timeout) && $this.removeData('bs.validator.timeout')
      })

    this.$element.find('.help-block.with-errors')
      .each(function () {
        var $this = $(this)
        var originalContent = $this.data('bs.validator.originalContent')

        $this
          .removeData('bs.validator.originalContent')
          .html(originalContent)
      })

    this.$btn.removeClass('disabled')

    this.$element.find('.has-error, .has-danger, .has-success').removeClass('has-error has-danger has-success')

    return this
  }

  Validator.prototype.destroy = function () {
    this.reset()

    this.$element
      .removeAttr('novalidate')
      .removeData('bs.validator')
      .off('.bs.validator')

    this.$inputs
      .off('.bs.validator')

    this.options    = null
    this.validators = null
    this.$element   = null
    this.$btn       = null

    return this
  }

  // VALIDATOR PLUGIN DEFINITION
  // ===========================


  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var options = $.extend({}, Validator.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var data    = $this.data('bs.validator')

      if (!data && option == 'destroy') return
      if (!data) $this.data('bs.validator', (data = new Validator(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.validator

  $.fn.validator             = Plugin
  $.fn.validator.Constructor = Validator


  // VALIDATOR NO CONFLICT
  // =====================

  $.fn.validator.noConflict = function () {
    $.fn.validator = old
    return this
  }


  // VALIDATOR DATA-API
  // ==================

  $(window).on('load', function () {
    $('form[data-toggle="validator"]').each(function () {
      var $form = $(this)
      Plugin.call($form, $form.data())
    })
  })

}(jQuery);


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_style_css__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__css_style_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__css_style_css__);



var Widgets = Widgets ? Widgets : function () {

  var privado = {

      host: null,
      container: null,
      callback: null,
      
      submitMSG: function(valid, msg){
          if(valid){
              var msgClasses = "h3 text-center tada animated text-success";
          } else {
              var msgClasses = "h3 text-center text-danger";
          }
          $("#safetyauth_widget_msgSubmit").removeClass().addClass(msgClasses).text(msg);
      },

      formSuccess: function(){
          $("#safetyauth_widget_contactForm")[0].reset();
          privado.submitMSG(true, "Mensaje enviado!")
      },
      
      formError: function(){
          $("#safetyauth_widget_contactForm").removeClass().addClass('shake animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
              $(this).removeClass();
          });
      },
      submitForm: function(){
          var emailContactAuthEndPoint = "http://authorization.dev.safetyauth.com/improve/oauth2/token";
          var emailContactResourceEndPoint = "http://services.dev.safetyauth.com/api/v1/improve/email/contactinformation";
          var token = '';
          //Getting Token
          var myAjax = $.ajax({
              type: "POST",
              url: emailContactAuthEndPoint,
              contentType: "application/x-www-form-urlencoded",
              data: 'client_id=9c9b0b5137b34e0fa5bab88ee3ea6e94&grant_type=client_credentials'
          });

          myAjax.done(function(data){
              token = data.access_token;
              // Initiate Variables With Form Content
              var name = $("#safetyauth_widget_name").val();
              var last_name = $("#safetyauth_widget_last_name").val();
              var email = $("#safetyauth_widget_email").val();
              var subject = $("#safetyauth_widget_msg_subject").val();
              var message = $("#safetyauth_widget_message").val();
              var phone = $("#safetyauth_widget_phone").val();
          
              var requestContactEmail = {
                  ContactEmail : {
                                  FirstName: name,  
                                  LastName: last_name, 
                                  Email: email,
                                  Phone: phone,
                                  Subject : subject,
                                  Message: message
                              }
              };
              $.ajax({
                  type: "POST",
                  headers: { 'Authorization': 'bearer ' + token},
                  url: emailContactResourceEndPoint,
                  contentType: "application/json",
                  data: JSON.stringify(requestContactEmail),
                  success : function(response, status, xhr){
                      if (xhr.status === 200)
                          privado.formSuccess();
                      else{
                          privado.formError();
                          privado.submitMSG(false, "Error en enviar correo.");
                      }
                  }
              });
          });
          myAjax.fail(function (jqXHR, textStatus, errorThrown){
              console.log('error', jqXHR);
          });
      },

      loadhtml: function (container, urlraw, callback) {
          var urlselector = (urlraw).split(" ", 1);
          var url = urlselector[0];
          var selector = urlraw.substring(urlraw.indexOf(' ') + 1, urlraw.length);
          privado.container = container;
          privado.callback = callback;
          $.get(urlraw, function (msg) {
              privado.container.html(msg);
              if ($.isFunction(privado.callback)) {
                  privado.callback();
              }
          });
      },

      // wire widget after it's loaded
      ContactUs_Init: function () {
          $('#safetyauth_widget_contactForm').validator();
          // this function is OnClick event for the link
          $('#safetyauth_widget_submitContactUs').click(function (e) {
              e.preventDefault();
              privado.submitForm();
          });

          // initializing the widget.
          // nothing for now.
      }
  };

  var publico = {

      // load widget into 'container' from 'host'
      Contact: function (container, host) {
          privado.host = host;
          privado.loadhtml(container, 'http://' + privado.host + '/contactUs.html',
              privado.ContactUs_Init);
      }
  }

  return publico;
}();



/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(6)(false);
// imports


// module
exports.push([module.i, "body {\n    height: 100%;\n    margin: 0;\n    padding: 0;\n    background: rgba(9,6,36,.80);\n    font-family: 'Open Sans', sans-serif;\n    color: #cccaea;\n    overflow: auto;\n    text-align: center;\n  }\n  \n  main {\n    /* IE11 doesn't know that `main` HTML element is a block element. */\n    display: block;\n  }\n  \n  strong {\n    color: #fff;\n  }\n  \n  h1 {\n    margin: 0 0 1rem;\n    font-family: 'Montserrat', sans-serif;\n    font-weight: bold;\n    font-size: 26px;\n    text-align: center;\n  }\n  \n  h3 {\n    font-family: 'Montserrat', sans-serif;\n    font-size: 12px;\n    text-transform: uppercase;\n  }\n  \n  a {\n    color: #cccaea;\n    text-decoration: none;\n  }\n  \n  a:hover {\n    text-decoration: underline;\n  }\n  \n  .flex {\n    display: flex;\n    flex-wrap: wrap;\n  }\n  \n  .hidden {\n    display: none !important;\n  }\n  \n  .invisible {\n    opacity: 0;\n  }\n  \n  .fade {\n    transition: opacity 250ms ease-in;\n  }\n  \n  .gutter {\n    position: absolute;\n    left: 0;\n    top: 0;\n  }\n  \n  .table {\n    width: 100%;\n    height: 100%;\n    display: table;\n  }\n  \n  .cell {\n    display: table-cell;\n    vertical-align: middle;\n  }\n  \n  .modal {\n    margin: 0 auto;\n    display: table;\n    border-radius: 0.5rem;\n    background-color: #0d0a24;\n    box-shadow: 0px 3px 20px rgba(0, 0, 0, .4);\n  }\n  \n  .modal, #form {\n    width: 532px;\n  }\n  \n  .modal > main {\n    position: relative;\n    padding: 2rem 2rem 0.5rem;\n  }\n  \n  .modal #close {\n    position: absolute;\n    right: 0.8rem;\n    top: 0.8rem;\n  }\n  \n  .modal #close:hover {\n    cursor: pointer;\n  }\n  \n  .modal #close img {\n    width: 1.4rem;\n    height: 1.4rem;\n  }\n  \n  .modal #loading {\n    position: absolute;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    right: 0;\n  }\n  \n  .modal #loading img {\n    max-width: 4rem;\n  }\n  \n  .modal #logos {\n    margin-bottom: 1rem;\n    text-align: center;\n  }\n  \n  .modal #logos img {\n    width: 60px;\n    height: 60px;\n    margin: 0 0.5rem;\n  }\n  \n  .modal #content,\n  .modal #countdown {\n    margin-bottom: 1.6rem;\n  }\n  \n  .modal #countdown {\n    display: none;\n  }\n  \n  /*body.countdown .modal #countdown {\n    display: flex;\n  }*/\n  \n  .modal #countdown figure {\n    margin: 0 0.5rem;\n    flex: 8;\n  }\n  \n  .modal #countdown .separator {\n    color: #cccaea;\n    font-size: 1.5rem;\n    line-height: 2.5rem;\n    flex: 1;\n  }\n  \n  .modal #countdown figure > div {\n    background: #1f1c35;\n    border-radius: 0.2rem;\n    font-size: 2rem;\n  }\n  \n  .modal #countdown figure figcaption {\n    margin-top: 0.4rem;\n    font-size: 0.6rem;\n    text-transform: uppercase;\n  }\n  \n  .modal form {\n    margin: 0 auto;\n    display: flex;\n    flex-wrap: wrap;\n  }\n  \n  .modal form ::placeholder {\n    color: #9399c7;\n    opacity: 1;\n  }\n  \n  .modal form .flex {\n    max-width: 50%;\n    flex: 1 50%;\n  }\n  \n  .modal input,\n  .modal textarea,\n  .modal button {\n    min-width: 9%;\n    margin: 0 0 0.5rem 0;\n    padding: 0.6rem;\n    color: #0d0a24;\n    background-color: #fff;\n    border: none;\n    border-radius: 0.2rem;\n    font-family: 'Open Sans', sans-serif;\n    font-size: 0.9rem;\n    // letter-spacing: 0.1rem;\n    flex: 1 0 40%;\n  }\n  .modal textarea {\n    padding-bottom: 0px;\n  }\n  \n  .modal input[type=\"submit\"],\n  .modal button {\n    flex: 1 100%;\n    margin-bottom: 0;\n    padding: 1rem;\n    background-color: #49c7ae;\n    color: white;\n    font-size: 1.2rem;\n    font-weight: bold;\n    border: none;\n    text-transform: uppercase;\n    letter-spacing: 0.1rem;\n    appearance: none;\n  }\n  \n  .modal input[type=\"submit\"]:hover,\n  .modal button:hover {\n    cursor: pointer;\n  }\n  \n  .modal input[type=\"submit\"] img,\n  .modal button img {\n    max-width: 1.4rem;\n    max-height: 1.4rem;\n    vertical-align: bottom;\n  }\n  \n  .modal input[type=\"checkbox\"] {\n    min-width: 0;\n    margin: 0 0.5rem 0 0;\n  }\n  \n  .modal input[name=\"member[first_name]\"],\n  .modal input[name=\"member[email]\"] {\n    flex: 1 0 43%;\n  }\n  \n  .modal input[name=\"member[first_name]\"] {\n    margin-right: 0.25rem;\n  }\n  \n  .modal input[name=\"member[email]\"] {\n    margin-left: 0.25rem;\n  }\n  \n  .modal input[name=\"member[street_address]\"] {\n    margin-right: 0.5rem;\n    flex: 3;\n  }\n  \n  .modal input[name=\"member[postcode]\"] {\n    margin-right: 0.25rem;\n    flex: 2;\n  }\n  \n  .modal input[name=\"member[phone_number]\"] {\n    margin-left: 0.25rem;\n  }\n  \n  .modal input[name=\"userPhone\"] {\n    margin-right: 0.5rem;\n    flex: 3;\n  }\n  \n  .modal textarea {\n    flex: 1 100%;\n  }\n  \n  .modal input[type=\"submit\"] {\n    flex: 1 100%;\n    margin-bottom: 0;\n    padding: 1rem;\n    background-color: #49c7ae;\n    color: white;\n    font-size: 1.2rem;\n    font-weight: bold;\n    border: none;\n    text-transform: uppercase;\n    letter-spacing: 0.1rem;\n    -webkit-appearance: none;\n  }\n  \n  \n  .modal .disclaimer {\n    width: 100%;\n    margin: 0.5rem 0;\n    color: #717093;\n    font-size: 0.8rem;\n  }\n  \n  .modal .disclaimer p {\n    margin: 0.5rem 0;\n  }\n  \n  .modal .disclaimer a {\n    color: #b1afda;\n  }\n  \n  .modal .disclaimer a.subtle {\n    color: initial;\n  }\n  \n  .modal .disclaimer .github {\n    width: 0.8rem;\n    height: 0.8rem;\n    margin-left: 0.2rem;\n    padding-bottom: 0.2rem;\n    vertical-align: middle;\n  }\n  \n  .modal #prompt .footer-links {\n    display: none;\n  }\n  \n  .modal footer {\n    padding: 1rem 2rem;\n    background-color: #141037;\n    border-radius: 0 0 0.5rem 0.5rem;\n  }\n  \n  .modal footer h3 {\n    margin: 0 0 1rem;\n    color: #908dc4;\n    text-align: left;\n  }\n  \n  .modal footer ul {\n    margin: 0;\n    padding: 0;\n    display: flex;\n    flex-wrap: wrap;\n    align-items: left;\n    justify-content: space-between;\n    list-style-type: none;\n  }\n  \n  .modal footer li {\n    margin: 0 0.25rem 0.5rem;\n    flex: 1 0 auto;\n  }\n  \n  .modal footer button {\n    width: 100%;\n    height: 2rem;\n    padding: 0 0.6rem;\n    background: transparent;\n    border: none;\n    border-radius: 0.2rem;\n    color: #fff;\n    font-size: 0.6rem;\n    font-weight: bold;\n    text-transform: uppercase;\n    line-height: 2rem;\n  }\n  \n  .modal footer button div {\n    display: flex;\n    flex-wrap: nowrap;\n    align-items: center;\n    justify-content: center;\n  }\n  \n  .modal footer button:hover {\n    cursor: pointer;\n  }\n  \n  .modal footer button img {\n    max-width: 1rem;\n    max-height: 1rem;\n    margin-right: 0.5rem;\n  }\n  \n  .modal footer button a {\n    color: #fff;\n    text-decoration: none;\n  }\n  \n  .modal footer button.facebook {\n    background-color: #2b48a7;\n    border: none;\n  }\n  \n  .modal footer button.twitter {\n    background-color: #2c8be4;\n    border: none;\n  }\n  \n  /* Variations */\n  body.fullscreen {\n    background-color: #1e1b33;\n    opacity: 0.89;\n  }\n  \n  body.fullscreen .modal {\n    position: unset;\n    background: transparent;\n    border-radius: 0;\n    box-shadow: none;\n    transform: none;\n  }\n  \n  body.countdown #logos {\n    display: none;\n  }\n  \n  body.countdown h1 {\n    color: #fd4935;\n    font-size: 36px;\n  }\n  \n  body.money h1 {\n    color: #ffc11a;\n  }\n  \n  body.stop h1 {\n    color: #ff3232;\n  }\n  \n  body.slow h1,\n  body.without h1 {\n    color: #279cff;\n  }\n  \n  @supports((-webkit-background-clip: text) and (-webkit-text-fill-color: transparent)) {\n    body.countdown h1 {\n      background: linear-gradient(#fd4935, #fd6d5a);\n      -webkit-background-clip: text;\n      -webkit-text-fill-color: transparent;\n    }\n  \n    body.slow h1,\n    body.without h1 {\n      background: linear-gradient(#39ebfd, #6b74fb);\n      -webkit-background-clip: text;\n      -webkit-text-fill-color: transparent;\n    }\n  }\n  \n  body.countdown .modal #content a {\n    color: #fd6d5a;\n  }\n  \n  body.countdown .modal input[type=\"submit\"],\n  body.countdown .modal button {\n    background-color: #fd4935;\n    border: none;\n  }\n  \n  body.money .modal #content a {\n    color: #dea50a;\n  }\n  \n  body.money .modal input[type=\"submit\"],\n  body.money .modal button {\n    background-color: #dea50a;\n    border: none;\n  }\n  \n  body.stop .modal #content a {\n    color: #ff3232;\n  }\n  \n  body.stop .modal input[type=\"submit\"],\n  body.stop .modal button {\n    background-color: #ff3232;\n    border: none;\n  }\n  \n  body.slow .modal #content a,\n  body.without .modal #content a {\n    color: #6679fc;\n  }\n  \n  body.slow .modal input[type=\"submit\"],\n  body.slow .modal button,\n  body.without .modal input[type=\"submit\"],\n  body.without .modal button {\n    background-color: #6679fc;\n    border: none;\n  }\n  \n  body.glitch .modal {\n    background-color: red;\n  }\n  \n  body.glitch .modal #logos img {\n    max-width: 500px;\n    width: 100%;\n    height: auto;\n  }\n  \n  body.glitch {\n    color: white;\n  }\n  \n  body.glitch a {\n    color: white;\n    text-decoration: underline;\n  }\n  \n  body.glitch .modal input, body.glitch .modal textarea {\n    color: white;\n    background-color: red;\n    border: 1px solid white;\n    font-weight: bold;\n  }\n  \n  body.glitch input::placeholder {\n    color: white;\n    text-transform: uppercase;\n  }\n  \n  body.glitch .modal button,\n  body.glitch .modal input[type=\"submit\"] {\n    background-color: white;\n    color: red;\n    font-size: 1.6rem;\n  }\n  \n  body.glitch .modal button img {\n    display: none;\n  }\n  \n  body.glitch .modal .disclaimer,\n  body.glitch .modal .disclaimer a {\n    color: white;\n  }\n  \n  body.glitch .modal footer button a {\n    color: red;\n  }\n  \n  body.glitch footer h3 { color: rgba(255, 255, 255, .66); }\n  body.glitch footer { background: rgba(0, 0, 0, .33); }\n  \n  /* One More Vote Theme */\n  \n  body.onemorevote .modal {\n    background-color: #171b24;\n    border-radius: 4px;\n  }\n  \n  body.onemorevote .modal > main {\n    padding: 0;\n  }\n  \n  body.onemorevote section {\n    padding: 2rem 2rem .5rem;\n  }\n  \n  body.onemorevote a#close {\n    top: 0;\n  }\n  \n  body.onemorevote a#close:hover {\n    text-decoration: none;\n  }\n  \n  body.onemorevote a#close img {\n    display: none;\n  }\n  \n  body.onemorevote a#close::before {\n    content:\"\\D7\";\n    text-decoration: none;\n    color: #cad7ee;\n    font-size: 36px;\n    font-family: 'Montserrat', sans-serif;\n  }\n  \n  body.onemorevote-capitol #logos {\n    margin: -2rem -2rem 0.5rem;\n  }\n  \n  body.onemorevote-text #logos {\n    margin-top: 1rem;\n  }\n  \n  body.onemorevote #logos img {\n    width: 100%;\n    height: auto;\n    margin: 0;\n  }\n  \n  body.onemorevote-text #logos img {\n    max-width: 380px;\n  }\n  \n  body.onemorevote input[type=\"submit\"] {\n    color: #13161c;\n    background-color: #f6ec40;\n  }\n  \n  body.onemorevote .disclaimer p#rotation {\n    margin-bottom: 40px;\n  }\n  \n  body.onemorevote .footer-links {\n    color: #1d222d;\n    background-color: #13161e;\n    position: absolute;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    margin: 0;\n    padding: 12px;\n    border-radius: 0 0 4px 4px;\n    font-family: 'Montserrat', sans-serif;\n    font-weight: bold;\n    font-size: 12px;\n  }\n  \n  body.onemorevote .footer-links a {\n    color: #3f495d;\n    text-transform: uppercase;\n    display: inline-block;\n    margin: 0 5px;\n  }\n  \n  body.onemorevote .footer-links img.github {\n    display: none;\n  }\n  \n  body.onemorevote-capitol #progress-bar {\n    height: 20px;\n  }\n  \n  body.onemorevote .progress-bar {\n    white-space: nowrap;\n  }\n  \n  body.onemorevote .progress-bar .bar {\n    display: inline-block;\n    height: 20px;\n    width: 6px;\n    background-color: #f7ea54;\n    border-radius: 3px;\n    margin: 0 2px;\n  }\n  \n  body.onemorevote .progress-bar .bar.active {\n    background-color: #a1afc8;\n  }\n  \n  body.onemorevote .progress-bar.done .bar:last-child {\n    animation: progress-bar-done 1.5s infinite;\n  }\n  \n  body.onemorevote #prompt h1 {\n    /* background-image: url(../images/one-more-vote-thanks.png); */\n    background-size: 100%;\n    background-repeat: no-repeat;\n    background-position: center;\n    width: 366px;\n    height: 28px;\n    margin: 20px auto;\n  }\n  \n  body.onemorevote #prompt h1 span {\n    display: none;\n  }\n  \n  body.onemorevote #prompt input[name=\"userPhone\"],\n  body.onemorevote #prompt input[type=\"submit\"] {\n    width: 50%;\n    flex: 1;\n    height: 3em;\n    padding-top: 0;\n    padding-bottom: 0;\n    font-size: 1em;\n  }\n  \n  body.onemorevote #prompt .disclaimer a.privacy-policy {\n    display: none;\n  }\n  \n  body.onemorevote #prompt .footer-links {\n    display: block;\n  }\n  \n  body.onemorevote #script h1 {\n    /* background-image: url(../images/one-more-vote-calling-now.png); */\n    background-size: 100%;\n    background-repeat: no-repeat;\n    background-position: center;\n    width: 222.5px;\n    height: 25.5px;\n    margin: 20px auto;\n  }\n  \n  body.onemorevote #script h1 span {\n    display: none;\n  }\n  \n  body.onemorevote #script .polite {\n    font-weight: bold;\n    color: #fff;\n  }\n  \n  body.onemorevote #script .polite .quote {\n    display: block;\n    color: #a2b0ca;\n    font-weight: normal;\n    font-style: italic;\n    margin: 10px;\n  }\n  \n  body.onemorevote #script .busy {\n    background-color: #212733;\n    font-size: 13px;\n    font-weight: 700;\n    color: #fff;\n    display: inline-block;\n    padding: 4px 8px;\n    /* background-image: url(../images/warning-icon.png); */\n    background-repeat: no-repeat;\n    background-size: 15px 15px;\n    background-position: 5px center;\n    padding-left: 26px;\n  }\n  \n  body.onemorevote #footer {\n    background-color: #0f1219;\n  }\n  \n  body.onemorevote #footer h3 {\n    text-align: center;\n    color: #94a3c3;\n  }\n  \n  body.onemorevote #footer button {\n    background-color: #2d3444;\n    background-size: 15px 15px;\n    background-color: #2d3444;\n    background-size: auto 15px;\n    color: #94a3c3;\n    background-repeat: no-repeat;\n    background-position: 8px center;\n    padding-left: 22px;\n  }\n  \n  body.onemorevote #footer button img {\n    display: none;\n  }\n  \n  body.onemorevote #footer button.facebook {\n    /* background-image: url(../images/facebook-circle-icon.png); */\n  }\n  \n  body.onemorevote #footer button.twitter {\n    /* background-image: url(../images/twitter-circle-icon.png); */\n  }\n  \n  body.onemorevote #footer .donate button {\n    /* background-image: url(../images/donate-icon.png); */\n  }\n  \n  body.onemorevote #footer button.ooni {\n    /* background-image: url(../images/phone-icon.png); */\n  }\n  \n  /* Animations */\n  @keyframes fade-in {\n    from { opacity: 0; }\n    to { opacity: 1; }\n  }\n  \n  @keyframes modal {\n    0% { transform: translateY(100px); opacity: 0; }\n    100% { transform: translateY(0); opacity: 1; }\n  }\n  \n  @keyframes progress-bar-done {\n    from { \n      background-color: #f7ea54;\n      box-shadow: 0px 0px 8px 2px rgba(246, 236, 64, 0.5); \n    }\n    to {\n      background-color: #a1afc8;\n      box-shadow: none;\n    }\n  }\n  \n  .modal {\n    animation-duration: 1s;\n    animation-name: modal;\n    animation-timing-function: ease-out;\n  }\n  \n  /* Disable animations if user prefers */\n  @media (prefers-reduced-motion: reduce) {\n    body, .modal, body.slow #logos img {\n      animation-name: fade-in;\n    }\n  }\n  \n  /* Mobile */\n  @media (max-width: 674px) {\n    .gutter {\n      width: initial;\n      max-width: 100%;\n    }\n  \n    .modal { \n      width: initial;\n      max-width: 100%;\n    }\n  \n    .modal form .flex {\n      max-width: 100%;\n      flex: 0 0 100%;\n    }\n  \n    .modal input[name=\"member[first_name]\"],\n    .modal input[name=\"member[email]\"] {\n      flex: 1 36%;\n    }\n  \n    .modal input[name=\"member[postcode]\"] {\n      margin-right: 0;\n    }\n  \n    .modal input[name=\"member[phone_number]\"] {\n      flex: 1 80%;\n      margin-left: 0;\n    }\n  \n    .progress-bar {\n      zoom: 0.6;\n      white-space: normal;\n    }\n  }\n  \n  @media (min-width: 530px) {\n    .modal footer li:first-child {\n      margin-left: 0;\n    }\n  \n    .modal footer li:last-child {\n      margin-right: 0;\n    }\n  }\n  \n  @media (max-width: 430px) {\n    .modal input[name=\"userPhone\"] {\n      min-width: 90%;\n      margin: 0 0 0.5rem 0;\n    }\n    .modal .prompt input[type=\"submit\"],\n    .modal .prompt button {\n      max-width: 100%;\n    }\n  }\n  \n  @media (max-width: 375px) {\n    .modal input[name=\"member[first_name]\"],\n    .modal input[name=\"member[email]\"] {\n      flex: 1 33%;\n    }\n  }\n  \n  @media (max-width: 320px) {\n    .progress-bar {\n      zoom: 0.5;\n    }\n  }", ""]);

// exports


/***/ }),
/* 6 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ })
/******/ ]);