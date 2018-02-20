'use strict';
import '../css/style.css';

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

