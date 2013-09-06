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
  var jwtToken = [
    'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJhdWQiOiAiR29vZ2xlIiwgImlzc' +
    'yI6ICIxMDg3MzY2MDM1NDYyMDA5NDcxNiIsICJyZXF1ZXN0IjogeyJwcmljZSI6ICI5Ljk' +
    '5IiwgImN1cnJlbmN5Q29kZSI6ICJVU0QiLCAic2VsbGVyRGF0YSI6ICIrZ29sZCwgK25vL' +
    '2NvdXBvbi9kaXNjb3VudCIsICJuYW1lIjogIlZpcnR1YWwgR29sZCBNZWRhbCIsICJkZXN' +
    'jcmlwdGlvbiI6ICJBIHZpcnR1YWwgZ29sZCBtZWRhbCBmcm9tIHRoZSAyMDEwIG9seW1wa' +
    'WMgZ2FtZXMgZm9yIG1lbidzIGZyZWVzdHlsZSBza2lpbmcuIn0sICJleHAiOiAxMzEyMjM' +
    '5OTY1LCAiaWF0IjogMTMxMjIzOTM2NSwgInR5cCI6ICJnb29nbGUvcGF5bWVudHMvaW5hc' +
    'HAvaXRlbS92MSJ9.JTWbPw4_ujX9-VN5pw13Bs27k0YUwhDFY_3TaBc2LEM'
  ].join();
  
  $('#jwt-input').val(jwtToken);
  
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
