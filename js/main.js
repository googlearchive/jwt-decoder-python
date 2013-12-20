/**
 * @fileoverview Javascript methods used to Makes AJAX calls to decode the
 * entered JWT value and updates the UI with the result.
 * @author saini@google.com (Shantanu Saini)
 */

/**
 * Indentation required for JSON object.
 * @type {number}
 * @const
 */
var JSON_INDENT = 4;

/**
 * Makes AJAX calls to decode the entered JWT value and updates the
 * UI with the result.
 */
function processJWT() {
  $('.error').hide();
  $('.result').hide();
  var jwtInput = $('#jwt-input').val().split('.');

  if (!jwtInput || jwtInput.length != 3) {
    $('.error').show();
    return false;
  }

  var jwtHeader = {data: jwtInput[0], id:'header'};
  var jwtClaims = {data: jwtInput[1], id:'claims'};
  var jwtSignature = jwtInput[2];
  var jwtDecode = [jwtHeader, jwtClaims];

  $('.result').show();
  $('#decoded-signature').text(jwtSignature);

  for (var i = 0; i < jwtDecode.length; i++) {
    (function() {
      var data = 'jwt=' + jwtDecode[i].data;
      var id = '#decoded-' + jwtDecode[i].id;

      var post = $.post('/decode/', data);
      post.done(function(data) {
        $(id).text(data);
      });
      post.fail(function() {
        $(id).text('Decoding failed. Please try again.');
      });
    })();
  }
}

/**
 * Init method.
 */ 
function init() {
  
  $('#jwt-input').focus(function() {
    var $this = $(this);
    $this.select();

    // Work around Chrome's little problem.
    $this.mouseup(function() {
        // Prevent further mouseup intervention.
        $this.unbind('mouseup');
        return false;
    });
  });
  
  $('#decode-button').click(processJWT);
}
