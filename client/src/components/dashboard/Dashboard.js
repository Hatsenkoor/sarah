import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser  } from "../../actions/authActions";
import { getDomainsOwnerAction, modifyDomainAction, createIPFSAction } from "../../actions/domainActions";
import './Dashboard.css';
import { Carousel, Input, Row, Col, Pagination, Button, message, Table, Modal, Spin } from 'antd';

const { Search } = Input;

var data = [];
var modaldata = [];
const modalcolumns = [
  {
    title: 'Name',
    dataIndex: 'name'
  }, 
  {
    title: 'IPFS Page',
    dataIndex: 'ipfs'
  }
]
const columns = [
  {
    title : 'No',
    dataIndex: 'no',
    width: '5%'
  },
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Cost/JIN',
    dataIndex: 'cost',
    sorter: (a, b) => a.cost - b.cost,
  },
  {
    title: 'Created At',
    dataIndex: 'created',    
    width: '20%',
  },
  {
      title: "Updated At",
      dataIndex: 'updated',
      width: '20%'
  },
  {
    title: "Actions",
    dataIndex: 'action',
    width: '20%'
  }
];

const contentStyle = {
  //   marginTop: '100px',
    height: '250px',
    color: '#fff',
    background: "linear-gradient(180deg, red, yellow)",
    paddingTop: '50px',
    paddingLeft: '100px',
    paddingRight: '100px',
  //   lineHeight: '160px',
    textAlign: 'center',
    background: 'rgba(0,0,0,0)',
};

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
        listLoading: true,
        listLoadingMsg: "Getting Domain List...",        
        ipfsModalVisible: false,
        priceModalVisible: false,
        selectedPrice: 1,
        selectedDomain: "",
        currentdomain: {},
        ipfshash: ""
    };
  }
  onLogoutClick = e => {
      e.preventDefault();
      this.props.logoutUser();
  };

  componentDidMount() {
      this.props.getDomainsOwnerAction();
  }

  componentWillReceiveProps(nextProps) {
      if (nextProps.domain.status == "Get Domains Owner" && nextProps.domain.success == true) {
          data = [];
          modaldata = [];
          var id = 0;
          nextProps.domain.domains.forEach(item => {
            if (item.data.domainhashcode && item.data.domain){
              data.push({
                no: id+1,
                key: id,
                wallet: item.data.walletaddress,
                   name: (item.data.domain),
                   cost: item.data.price,
                   created: new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(item.data.created), 
                   updated: new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(item.data.updated),
                   action : <div><button type="danger" name={id} style={{marginRight: '10px'}} onClick={this.setPrice}>{"Set Price"}</button></div>
                });
                modaldata.push({
                  key: id,
                  name: item.data.domain,
                  ipfs: <a href = {`https://gateway.pinata.cloud/ipfs/${item.data.ipfshash}`} target = "_blank">{"https://gateway.pinata.cloud/ipfs/" + item.data.ipfshash}</a>
                  
                });
              }
              id++;
          });
          this.setState({listLoading: false});
          return;
      }

      if (nextProps.domain.status == "Modify Price") {
         if (nextProps.domain.success) {
            // message.success("Modify Price Success!");
            console.log(this.state.currentdomain);
            var param = {
              domain: this.state.currentdomain.name,
              price: this.state.selectedPrice,
              qrcode: 'pngUrl',
              created: this.state.currentdomain.created,
              updated: Date.now()
            }
            this.props.createIPFSAction(param);
            // this.props.getDomainsOwnerAction();
         } else {
            message.error("Modify Price Failed!");
            return;
         }
      }

      if (nextProps.domain.success && nextProps.domain.status == "Create IPFS Page") {
          this.setState({
            ipfshash : nextProps.auth.ipfsHash
          });
          const domainParam = {              
              domain: this.state.currentdomain.name,              
              ipfshash: nextProps.auth.ipfsHash
          } 
          this.props.modifyDomainAction(domainParam);
      }

      if (nextProps.domain.success && nextProps.domain.status == "Modify IPFS"){
         message.success("Changed successfully!");
         this.props.getDomainsOwnerAction();
         return;
      }
  }

  setPrice = (e) => {
      console.log(data[e.target.name]);      
      this.setState({selectedDomain: data[e.target.name].name});
      this.setState({currentdomain: data[e.target.name]});
      this.setPriceModalVisible(true);
  }

  modifyPrice = () => {
      var paramObj = {
          price: this.state.selectedPrice,
          domain: this.state.selectedDomain
      }
      this.setState({
        listLoading: true,
        listLoadingMsg: "Modifying Domain. Please wait..."
      })
      this.props.modifyDomainAction(paramObj);
      this.setPriceModalVisible(false);
  }

  setForSale = () => {

  }

  setPriceModalVisible = (flag) => {
    this.setState({priceModalVisible: flag});
  }

  setModalVisible = (flag) => {
    this.setState({ipfsModalVisible: flag});
  }

  onChange = () => {

  }

  onPriceChange = (e) => {
      console.log(e.target.value);
      this.setState({selectedPrice: e.target.value});
  }

  onSearch = (value) => {
    this.setState({
       listLoadingMsg: "Searching Domains...",
       listLoading: true
    });
    this.props.getDomainsOwnerAction({searchword: value});
  }

  render() {
    const { user } = this.props.auth;
    const { ipfsModalVisible, priceModalVisible, listLoading, listLoadingMsg, selectedPrice } = this.state;
    return (<Spin tip={listLoadingMsg} spinning={listLoading}>
      <div className="domain-main-container">
                <Carousel afterChange={this.onChange} className="domain-carousel" >
                    <div className="slide1">
                        <h3 style={contentStyle}>You’ve got the ideas, we’ve got the domains.</h3>
                    </div>
                    <div className="slide2">
                        <h3 style={contentStyle}>0x21 combines the latest in decentralized communication, payments and file sharing so that we can take back the Internet again and utilize it how it's meant to be</h3>
                    </div>
                    <div className="slide3">
                        <h3 style={contentStyle}>By using a modern blockchain storage technology as it’s backbone and Peer to Peer (decentralized) chat you are NOT subject to a shutdown of any centrally controlled server.</h3>
                    </div>
                    <div className="slide4">
                        <h3 style={contentStyle}>The platform is created in Open-Source. The source-code will be made freely available to anyone at https://github.com/0x21cloud/0x21main.
                            <Row className="linkbtn">
                                <Button type="success" size={"large"} ghost>Go To Open-Source</Button>
                            </Row>
                        </h3>
                        
                    </div>
                </Carousel>
                <div>
                    <Search placeholder="Enter your domain name" onSearch={this.onSearch} enterButton className = "domain-main-search" size={"large"}/>
                </div>
                <Row className = "domain-main-panel">
                    <Col span = {8} className = "domain-main-ipfs">
                        <Row className = "ipfs-title">
                            <h1>Web Page IPFS Hash Code</h1>                            
                        </Row>
                        <Row className = "ipfs-edit">
                            <Button type="success" ghost onClick = {() => this.setModalVisible(true)}>Edit</Button>
                        </Row>
                    </Col>
                    <Col span = {16} className = "domain-main-table">
                        <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }}/>
                        {/* <Pagination onChange={onChange} total={4} pageSize={4}/> */}
                    </Col>
                </Row>
                <Modal
                  title="View/Edit your IPFS Web Page"
                  centered
                  visible={ipfsModalVisible}
                  onOk={() => this.setModalVisible(false)}
                  onCancel={() => this.setModalVisible(false)}
                  width={1000}
                >
                   <Table columns={modalcolumns} dataSource={modaldata} pagination={{ pageSize: 5 }}/>
                </Modal>
                <Modal
                  title="Change your domain price"
                  centered
                  visible={priceModalVisible}
                  onOk={this.modifyPrice}
                  onCancel={() => this.setPriceModalVisible(false)}
                  width={500}
                >
                    <Input type="number" min = {selectedPrice} onChange = {this.onPriceChange} /> 
                </Modal>
            </div>
        </Spin>
    );
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  createIPFSAction: PropTypes.func.isRequired,
  
  getDomainsOwnerAction : PropTypes.func.isRequired,
  modifyDomainAction: PropTypes.func.isRequired,
  domain: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  domain: state.domain
});

export default connect(
  mapStateToProps,
  { logoutUser, getDomainsOwnerAction, modifyDomainAction, createIPFSAction }
)(Dashboard);