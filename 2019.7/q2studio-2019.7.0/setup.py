# ----------------------------------------------------------------------------
# Copyright (c) 2016-2019, QIIME 2 development team.
#
# Distributed under the terms of the Modified BSD License.
#
# The full license is in the file LICENSE, distributed with this software.
# ----------------------------------------------------------------------------

from setuptools import find_packages, setup

with open("README.md") as fh:
    long_description = fh.read()

setup(
    name='q2studio',
    version='2019.7.0',
    license='BSD-3-Clause',
    url='https://qiime2.org',
    long_description=long_description,
    packages=find_packages(),
    install_requires=['click', 'flask', 'gevent', 'qiime2 == 2019.7.*']
)
