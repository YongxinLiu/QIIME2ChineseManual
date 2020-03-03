// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import React from 'react';
import { highlightBlock } from 'highlight.js';
import ReactMarkdown from 'react-markdown';

import JobHistoryData from './JobHistoryData';

import '!style-loader!css-loader!../../css/hljs.css'; // eslint-disable-line
import style from '../../css/JobHistory.css';


class JobHistory extends React.Component {
    constructor(props) {
        super(props);
        this.order = ['UUID', 'Completed', 'Error', 'Inputs', 'Params',
            'Outputs', 'Started', 'Finished', 'stdout', 'stderr'];
    }

    componentDidMount() {
        for (const codeBlock of document.querySelectorAll('pre')) {
            codeBlock.className += ` ${style.pre}`;
        }
        for (const codeBlock of document.querySelectorAll('pre code')) {
            highlightBlock(codeBlock);
            codeBlock.className += ` ${style.code}`;
        }
    }

    render() {
        return (
            <div className="container">
                <div className="page-header">
                    <h1>{this.props.job.actionName}</h1>
                </div>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        Job Info:
                    </div>
                    <div className="panel-body">
                        <table className={`table ${style.table}`}>
                            <tbody>
                                {this.order.map(key =>
                                    <JobHistoryData
                                        key={key}
                                        name={key}
                                        value={this.props.job[key.toLowerCase()]}
                                    />
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="panel panel-default">
                    <div className="panel-heading">
                        Job Code:
                    </div>
                    <div className="panel-body">
                        <ReactMarkdown className="python" source={this.props.job.code} />
                    </div>
                </div>
            </div>
        );
    }
}

JobHistory.propTypes = {
    job: React.PropTypes.object
};

export default JobHistory;
