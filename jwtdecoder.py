"""
 Copyright 2013 Google Inc. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 """

"""Provides methods to handle jwt decoder request."""
import webapp2
import os
import base64
import logging
import unicodedata
import json
from google.appengine.ext.webapp import template


# Use compatibility decomposition - replace all compatible characters with their
# equivalents.
NORMAL_FORM = 'NFKD'


def decodeJWTView(request):
  """Processes POST request and sends decoded JWT as pretty printed JSON object.

  Args:
    request: A HTTP request object.

  Returns:
    A pretty printed JSON object if valid jwt is present, returns a HTTP 404
    otherwise.
  """
  input_jwt = request.POST.get('jwt', None)
  if not input_jwt:
    webapp2.abort(404)

  try:
    input_jwt = unicodedata.normalize(NORMAL_FORM, input_jwt).encode(
        'ascii', 'ignore')
    # Append extra characters to make original string base 64 decodable.
    input_jwt += '=' * (4 - (len(input_jwt) % 4))
    decoded_jwt = base64.urlsafe_b64decode(input_jwt)
  except JSONDecodeError as e:
    result = {'error': True}
    webapp2.abort(404)
  else:
    decoded_jwt = json.loads(decoded_jwt)
    return webapp2.Response(json.dumps(decoded_jwt, indent=8))


def displayIndexView(request):
  """Serves the index page.

  Args:
    request: A HTTP request object.

  Returns:
    The index page.
  """
  path = os.path.join(os.path.dirname(__file__), 'index.html')
  template_values = None
  return webapp2.Response(template.render(path, template_values))


application = webapp2.WSGIApplication([
    ('/decode/', decodeJWTView),
    ('/', displayIndexView)])
