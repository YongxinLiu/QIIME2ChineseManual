// ----------------------------------------------------------------------------
// Copyright (c) 2016-2019, QIIME 2 development team.
//
// Distributed under the terms of the Modified BSD License.
//
// The full license is in the file LICENSE, distributed with this software.
// ----------------------------------------------------------------------------

import React from 'react';


const Tabs = (props) => {
    const { tabs, getCount, contents, currentIndex, changeTab, refresh } = props;
    return (
        <div className="panel panel-default">
            <div className="panel-heading">
                <ul className="nav nav-pills">
                    {tabs.map((tab, idx) => (
                        <li
                            key={tab}
                            role="presentation"
                            className={idx === currentIndex ? 'active' : null}
                        >
                            <a onClick={() => changeTab(idx)}>
                                { tabs[idx] }
                                { getCount && getCount(idx) ?
                                    <span className="badge">{getCount(idx)}</span> : null}
                            </a>
                        </li>
                    ))}
                    {refresh ?
                        (<li className="pull-right">
                            <button
                                type="button"
                                className="close"
                                aria-label="Refresh"
                                onClick={refresh}
                            >
                                <span
                                    className="glyphicon glyphicon-refresh"
                                    aria-hidden="true"
                                />
                            </button>
                        </li>)
                        :
                        null
                    }
                </ul>
            </div>
            <div className="panel-body">
                { contents[currentIndex] }
            </div>
        </div>
    );
};

Tabs.propTypes = {
    tabs: React.PropTypes.array,
    contents: React.PropTypes.array,
    currentIndex: React.PropTypes.number,
    changeTab: React.PropTypes.func,
    getCount: React.PropTypes.func,
    refresh: React.PropTypes.func
};

export default Tabs;
