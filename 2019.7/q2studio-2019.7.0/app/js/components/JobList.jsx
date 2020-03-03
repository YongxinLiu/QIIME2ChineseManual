// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import React from 'react';
import { ipcRenderer as ipc } from 'electron';

import JobRow from './JobRow';

const JobList = ({ jobs, jobTab }) => (
    <table className="table">
        <thead>
            <tr>
                <th className="col-md-6">Action</th>
                <th className="col-md-3">Started</th>
                <th className="col-md-3">
                    {jobTab !== 'active' ? 'Finished' : 'Elapsed'}
                </th>
            </tr>
        </thead>
        <tbody>
            {jobs.length ? (
                jobs.map(job =>
                    <JobRow
                        data={job}
                        key={job.uuid}
                        onClick={() => ipc.send('open-new-page', {
                            url: `job/${job.uuid}`
                        })}
                    />
                )) : (<tr><td>{`No ${jobTab} jobs...`}</td></tr>)
            }
        </tbody>
    </table>
);

JobList.propTypes = {
    jobs: React.PropTypes.array,
    jobTab: React.PropTypes.string
};

export default JobList;
