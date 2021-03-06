import React, { Component } from 'react';
import EthereumQRplugin from 'ethereum-qr-code'
import uniqueId from 'lodash.uniqueid';
import PropTypes from 'prop-types';

class EthereumQRCode extends Component {

  constructor(props) {
    super(props);
    this.generator = new EthereumQRplugin();
    this.id = uniqueId('qrCode');
  }

  componentDidMount() {
    this.generateQRCode();
  }

  componentDidUpdate(prevProps, prevState) {
    this.generateQRCode();
  }

  generateQRCode() {

    let sendDetails;
    console.log(this.props.value.toString());
    if (this.props.uriScheme) {
      sendDetails = this.generator.readStringToJSON(this.props.uriScheme);
    } else {
      sendDetails = {
        to: this.props.to,
        value: this.props.value.toString(),
        gas: this.props.gas
      };
    }

    const qrCode = this.generator.toCanvas(sendDetails, {
      selector: `#${this.id}`,
    });

    qrCode.then((code) => {
      console.log(code);
      if (this.props.afterGenerate) {
        this.props.afterGenerate(code);
        console.log("success generated");
        this.props.paymentSuccess();
      }
    })
  }

  render() {
    return (
      <div id={this.id}></div>
    );
  }
}

EthereumQRCode.propTypes = {
  uriScheme: PropTypes.string,
  to: PropTypes.string,
  value: PropTypes.number,
  gas: PropTypes.number,
  afterGenerate: PropTypes.func,
  paymentSuccess: PropTypes.func
}

export default EthereumQRCode