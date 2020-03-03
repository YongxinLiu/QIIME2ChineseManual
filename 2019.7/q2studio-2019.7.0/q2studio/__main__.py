# ----------------------------------------------------------------------------
# Copyright (c) 2016-2019, QIIME 2 development team.
#
# Distributed under the terms of the Modified BSD License.
#
# The full license is in the file LICENSE, distributed with this software.
# ----------------------------------------------------------------------------

from q2studio import start_server

# Allows `python -m q2studio` to start the server. This avoids polluting
# the user's namespace with "useless" binary.
if __name__ == '__main__':
    try:
        start_server()
    except KeyboardInterrupt:
        pass
