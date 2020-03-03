# ----------------------------------------------------------------------------
# Copyright (c) 2016-2019, QIIME 2 development team.
#
# Distributed under the terms of the Modified BSD License.
#
# The full license is in the file LICENSE, distributed with this software.
# ----------------------------------------------------------------------------

import hmac
import base64
from time import time

from flask import request, abort, current_app

__WHITELIST = ["OPTIONS"]


def validate_request_authentication():
    if request.method not in __WHITELIST:
        request_date = int(request.headers['X-QIIME-Timestamp'])
        auth, signature = request.headers.get('Authorization').split()
        message = [
            request.method.encode('utf8'),
            request.url.encode('utf8'),
            request.headers.get('X-QIIME-Timestamp', as_bytes=True),
            request.headers.get('Content-Type', as_bytes=True),
            request.data
        ]
        if request.data:
            message.append(request.headers.get('Content-Length',
                                               as_bytes=True))
        if (signature.encode('utf8') != make_b64_digest(message) or
                time() - (request_date / 1000) > 60):
            abort(403)


def make_b64_digest(content):
    hmac_generator = hmac.new(current_app.config['SECRET_KEY'],
                              digestmod="sha256")
    for value in content:
        hmac_generator.update(value)
    digest = hmac_generator.digest()
    return base64.b64encode(digest)
