# ----------------------------------------------------------------------------
# Copyright (c) 2016-2019, QIIME 2 development team.
#
# Distributed under the terms of the Modified BSD License.
#
# The full license is in the file LICENSE, distributed with this software.
# ----------------------------------------------------------------------------


def add_cors_headers(response):
    response.headers.add('Access-Control-Allow-Headers',
                         'Authorization, Content-Type, '
                         'Content-Length, X-QIIME-Timestamp')
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods',
                         'GET, PUT, POST, DELETE')
    return response
