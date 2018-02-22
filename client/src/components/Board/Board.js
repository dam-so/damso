import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';
import krStrings from 'react-timeago/lib/language-strings/ko';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import './Board.scss';

const formatter = buildFormatter(krStrings);

class Board extends Component {
  render() {
    const {
      title, description, managerInfo, date, statsFirst, statsSecond, toURL, boardIcon
    } = this.props;
    const boardIconView = (
      <div className="dataItem-icon">
        <span className="board-icon-background">
          <img className="board-icon" src="/chat.svg" alt="chat icon" />
        </span>
      </div>
    );
    const closeAndRedirect = (
      <span
        onClick={async () => {
          await this.props.closeUserInfoModal();
          this.props.history.push(toURL);
        }}
        role="presentation"
        className="close-redirect"
        onKeyDown={() => {}}
      >
        {title}
      </span>
    );
    return (
      <li className="dataItem">
        { boardIcon === 'true' ? boardIconView : ''}
        <div className="dataItem-main">
          <h4 className="dataItem-title">
            {
              this.props.closeAndRedirect ?
                closeAndRedirect
                :
                <Link
                  to={toURL}
                >
                  {title}
                </Link>
            }
          </h4>
          <div className="dataItem-description">
            <p>
              {description}
            </p>
          </div>
        </div>
        <div className="dataItem-stats">
          <dl>
            <dt className="dataItem-stats-first">
              {statsFirst}
            </dt>
            <dd className="dataItem-stats-second">
              {statsSecond}
            </dd>
          </dl>
        </div>
        <ul className="dataItem-manager">
          <li><img className="dataItem-manager-avatar" src={managerInfo[1] || '/no-avatar.svg'} alt="manager avatar" /></li>
          <li>{managerInfo[0]}</li>
          <li>{managerInfo[2]}</li>
          <li className="dataItem-manager-date"><TimeAgo date={date} formatter={formatter} /></li>
        </ul>
      </li>
    );
  }
}

export default withRouter(Board);
