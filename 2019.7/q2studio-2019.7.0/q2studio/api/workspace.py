# ----------------------------------------------------------------------------
# Copyright (c) 2016-2019, QIIME 2 development team.
#
# Distributed under the terms of the Modified BSD License.
#
# The full license is in the file LICENSE, distributed with this software.
# ----------------------------------------------------------------------------

import os
import glob

from flask import Blueprint, jsonify, request, abort, url_for


import qiime2
from qiime2.sdk import Artifact, Visualization
from ..util import fail_gracefully

workspace = Blueprint('workspace', __name__)

ARTIFACTS = {}
VISUALIZATIONS = {}
ACTIVE_VIS = {}


def load_artifacts(**kwargs):
    return {k: Artifact.load(ARTIFACTS[v]) for k, v in kwargs.items()
            if v != ''}


@workspace.route('/', methods=['GET'])
def get_workspace():
    return jsonify({'workspace': os.getcwd()})


@workspace.route('/', methods=['PUT'])
def change_workspace():
    request_body = request.get_json()
    new_dir = request_body['workspace']
    try:
        os.chdir(new_dir)
        return ''
    except Exception:
        # TODO: what's a good status code for this?
        abort(500)


def _result_record(metadata, name, route, source_format=None):
    return {
        'name': name,
        'uuid': metadata.uuid,
        'type': metadata.type,
        'uri': url_for(route, uuid=metadata.uuid)
    }


@workspace.route('/artifacts', methods=['GET'])
def get_artifacts():
    global ARTIFACTS
    ARTIFACTS = {}
    path = os.getcwd()
    artifact_paths = list(glob.glob(os.path.join(path, '*.qza')))
    artifacts = []
    for artifact_path in artifact_paths:
        try:
            metadata = Artifact.peek(artifact_path)
            name, _ = os.path.splitext(os.path.basename(artifact_path))
            artifacts.append(
                _result_record(metadata, name, '.inspect_artifact'))
            ARTIFACTS[metadata.uuid] = artifact_path
        except Exception:
            pass  # TODO: do better things when this happens

    return jsonify({'artifacts': artifacts})


@workspace.route('/artifacts', methods=['POST'])
@fail_gracefully
def create_artifact():
    request_body = request.get_json()
    artifact = Artifact.import_data(request_body['type'],
                                    request_body['path'],
                                    request_body['source_format'])
    path = os.path.join(os.getcwd(), request_body['name'])
    if not path.endswith('.qza'):
        path += '.qza'
    artifact.save(path)
    return ''


@workspace.route('/artifacts/<uuid>', methods=['POST'])
@fail_gracefully
def export_artifact(uuid):
    output = request.get_json().get('path')
    Artifact.load(ARTIFACTS[uuid]).export_data(output)
    return jsonify({'path': output})


@workspace.route('/artifacts/<uuid>', methods=['GET'])
def inspect_artifact(uuid):
    try:
        metadata = Artifact.peek(ARTIFACTS[uuid])
    except Exception:
        abort(404)

    return jsonify({'uuid': metadata.uuid, 'type': metadata.type})


@workspace.route('/artifacts/<uuid>', methods=['DELETE'])
def delete_artifact(uuid):
    try:
        os.remove(ARTIFACTS[uuid])
        return ''
    except (OSError, KeyError):
        abort(404)


@workspace.route('/visualizations', methods=['GET'])
def get_visualizations():
    global VISUALIZATIONS
    VISUALIZATIONS = {}
    path = os.getcwd()
    viz_paths = list(glob.glob(os.path.join(path, '*.qzv')))
    visualizations = []
    for viz_path in viz_paths:
        try:
            metadata = Visualization.peek(viz_path)
            name, _ = os.path.splitext(os.path.basename(viz_path))
            VISUALIZATIONS[metadata.uuid] = viz_path
            visualizations.append(
                _result_record(metadata, name, '.inspect_visualization'))
        except Exception:
            pass  # TODO: do better things when this happens

    return jsonify({'visualizations': visualizations})


@workspace.route('/visualizations/<uuid>', methods=['GET'])
def inspect_visualization(uuid):
    try:
        metadata = Visualization.peek(VISUALIZATIONS[uuid])
    except Exception:
        abort(404)

    return jsonify({'uuid': metadata.uuid, 'type': metadata.type})


@workspace.route('/visualizations/<uuid>', methods=['DELETE'])
def delete_visualization(uuid):
    try:
        os.remove(VISUALIZATIONS[uuid])
        return ''
    except (OSError, KeyError):
        abort(404)


@workspace.route('/view/<uuid>', methods=['GET'])
def view_visualization(uuid):
    try:
        vis = Visualization.load(VISUALIZATIONS[uuid])
        filePath = vis.get_index_paths(relative=False)['html']
        ACTIVE_VIS[uuid] = vis
    except Exception:
        abort(404)

    return jsonify({'filePath': filePath})


@workspace.route('/view/<uuid>', methods=['DELETE'])
def unview_visualization(uuid):
    try:
        del ACTIVE_VIS[uuid]
        return ''
    except KeyError:
        abort(404)


@workspace.route('/metadata', methods=['GET'])
def get_metadata():
    path = os.getcwd()
    metadata_paths = list(glob.glob(os.path.join(path, '*.txt')))
    metadata_paths += list(glob.glob(os.path.join(path, '*.tsv')))
    metadata = []
    for metadata_path in metadata_paths:
        try:
            qiime2.Metadata.load(metadata_path)
            metadata.append({
                "name": os.path.basename(metadata_path),
                "filepath": metadata_path
            })
        except Exception:
            pass  # TODO: do better things when this happens

    return jsonify({'metadata': metadata})

# TODO: More sophisticated handling of metadata in the future.
