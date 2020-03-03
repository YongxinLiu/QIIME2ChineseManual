# ----------------------------------------------------------------------------
# Copyright (c) 2016-2019, QIIME 2 development team.
#
# Distributed under the terms of the Modified BSD License.
#
# The full license is in the file LICENSE, distributed with this software.
# ----------------------------------------------------------------------------

from flask import Blueprint, jsonify, request
import qiime2.sdk

types = Blueprint('types', __name__)

PLUGIN_MANAGER = qiime2.sdk.PluginManager()


@types.route('/subtype', methods=['POST'])
def is_subtype():
    request_body = request.get_json()
    list_a = list(map(qiime2.sdk.parse_type, request_body['a']))
    list_b = list(map(qiime2.sdk.type_from_ast, request_body['b']))

    yes = {}
    no = {}
    for b in list_b:
        yes[repr(b)] = yays = []
        no[repr(b)] = nays = []
        for a in list_a:
            if a <= b:
                yays.append(repr(a))
            else:
                nays.append(repr(a))
    return jsonify({'yes': yes, 'no': no})


@types.route('/importable', methods=['POST'])
def get_importable_types():
    ret = [repr(t) for t in PLUGIN_MANAGER.importable_types]
    return jsonify(ret)
