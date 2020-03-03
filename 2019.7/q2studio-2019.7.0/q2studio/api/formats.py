# ----------------------------------------------------------------------------
# Copyright (c) 2016-2019, QIIME 2 development team.
#
# Distributed under the terms of the Modified BSD License.
#
# The full license is in the file LICENSE, distributed with this software.
# ----------------------------------------------------------------------------

from flask import Blueprint, jsonify
import qiime2.sdk

formats = Blueprint('formats', __name__)

PLUGIN_MANAGER = qiime2.sdk.PluginManager()


@formats.route('/importable', methods=['POST'])
def get_importable_formats():
    ret = list(PLUGIN_MANAGER.importable_formats)
    return jsonify(ret)
