import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Iframe.scss';

class Iframe extends Component {
  componentDidMount() {
    this._updateIframe();
    this.resizeIframe();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        this.resizeIframe();
      }, true);
    }
  }
  componentDidUpdate() {
    this._updateIframe();
  }
  componentWillUnmount() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', () => {
        this.resizeIframe();
      }, false);
    }
  }
  resizeIframe = () => {
    if (this.iframe) {
      this.iframe.style.height = `${this.iframe.contentDocument.body.getElementsByTagName('div')[0].scrollHeight + 30}px`;
    }
  }
  _updateIframe() {
    const document = this.iframe.contentDocument;
    const head = document.getElementsByTagName('head')[0];
    document.body.innerHTML = this.props.content;
    const ref = document.createElement('link');
    ref.rel = 'stylesheet';
    ref.type = 'text/css';
    ref.href = this.props.stylesheets;
    head.appendChild(ref);
  }
  render() {
    return (
      <iframe
        ref={el => this.iframe = el}
        title="Iframe"
        className="iframe"
        scrolling="no"
      />
    );
  }
}
Iframe.defaultProps = {
  content: '',
  stylesheets: ''
};

Iframe.propTypes = {
  content: PropTypes.string,
  stylesheets: PropTypes.string
};
export default Iframe;