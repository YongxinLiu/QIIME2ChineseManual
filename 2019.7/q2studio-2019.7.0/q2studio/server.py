# ----------------------------------------------------------------------------
# Copyright (c) 2016-2019, QIIME 2 development team.
#
# Distributed under the terms of the Modified BSD License.
#
# The full license is in the file LICENSE, distributed with this software.
# ----------------------------------------------------------------------------

import os
import sys
import base64

from flask import Flask
from gevent.pywsgi import WSGIServer

from q2studio.api import jobs, plugins, types, formats, workspace
from q2studio.security import validate_request_authentication
from q2studio.headers import add_cors_headers

studio = Flask('q2studio')
studio.register_blueprint(jobs, url_prefix='/api/jobs')
studio.register_blueprint(plugins, url_prefix='/api/plugins')
studio.register_blueprint(types, url_prefix='/api/types')
studio.register_blueprint(formats, url_prefix='/api/formats')
studio.register_blueprint(workspace, url_prefix='/api/workspace')

studio.before_request(validate_request_authentication)
studio.after_request(add_cors_headers)


def start_server():
    studio.debug = True
    # setup secret key
    studio.config['SECRET_KEY'] = secret_key = os.urandom(33)
    secret_key = base64.b64encode(secret_key).decode('ascii')
    # setup OS-assigned port
    server = WSGIServer(('localhost', 0), studio, log=sys.stdout,
                        error_log=sys.stderr)
    server.start()
    # send key and port to parent process
    sys.stdout.write("%d %s" % (server.server_port, secret_key))
    sys.stdout.flush()  # (needed when output is in a pipe)
    # never stop not stopping
    server.serve_forever()
