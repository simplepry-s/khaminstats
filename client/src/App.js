import React, { Component } from 'react';
import './App.css';

import { If, Then, Else } from 'react-if-elseif-else-render';

import 'bootstrap/dist/css/bootstrap.css';
import { Button, Col, Row, Navbar, Nav, footer, Table } from 'react-bootstrap';
import Center from 'react-center';
import Fade from 'react-reveal/Fade';
//import 'font-awesome/css/font-awesome.min.css';


import { SocialIcon } from 'react-social-icons';


import { faSync , faToggleOn} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import { PropagateLoader } from 'react-spinners';

import { Bar, Line, Pie } from 'react-chartjs-2';

import Chart from './component/Chart';





class App extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.Switch = this.Switch.bind(this);
    this.state = {
      loading: true,
      loadingupdate: true,
      stats: [],
      statsig: [],
      compares: [],
      stattoday: [],
      isToggleOn: true,
      chartData: {},
      chartDataIG: {}

    }
  }



  Switch() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }



  handleClick() {

    this.setState({ loading: true });

 //weekly fb
    fetch('/users')
      .then(res => res.json())
      .then(stats => this.setState({ stats })
      );


    //weekly ig
    fetch('/users/ig')
      .then(res => res.json())
      .then(statsig => this.setState({ statsig })
      );


    //daily all
    fetch('/update/compare')
      .then(res => res.json())
      .then(compares => this.setState({ compares, loading: false }))



    //chart fb
    fetch('/users/monthlyfb')
      .then(res => res.json())
      .then(stats => this.getChartData(stats));

    //chartig
    fetch('/users/monthlyig')
      .then(res => res.json())
      .then(stats => this.getChartDataIG(stats));






      
  }










  componentDidMount() {



    //weekly fb
    fetch('/users')
      .then(res => res.json())
      .then(stats => this.setState({ stats })
      );


    //weekly ig
    fetch('/users/ig')
      .then(res => res.json())
      .then(statsig => this.setState({ statsig })
      );


    //daily all
    fetch('/update/compare')
      .then(res => res.json())
      .then(compares => this.setState({ compares, loading: false }))



    //chart fb
    fetch('/users/monthlyfb')
      .then(res => res.json())
      .then(stats => this.getChartData(stats));

    //chartig
    fetch('/users/monthlyig')
      .then(res => res.json())
      .then(stats => this.getChartDataIG(stats));


  }




  getChartData(temp) {
    // Ajax calls here




  
    var result = [];

    for (var i in temp)
      result.push(temp[i].stats);






    this.setState({
      chartData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Facebook',
            data: result,
            backgroundColor: [

              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(255, 99, 132, 0.6)'
            ]
          }
        ]
      }
    });
  }

  getChartDataIG(temp) {
    // Ajax calls here



    var result = [];

    for (var i in temp)
      result.push(temp[i].stats);




    this.setState({
      chartDataIG: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Instragram',
            data: result,
            backgroundColor: [

              'rgba(38, 190, 201, 1)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(255, 99, 132, 0.6)'
            ]
          }
        ]
      }
    });
  }
  render() {

    const { loading } = this.state;
    const { testdata } = this.state;
    console.log('test data');
    console.log(testdata);



    const check = { checkig: '', checkfb: '', checktextfb: 'align-middle text-success', checktextig: 'align-middle text-success', date: '' }

    if (this.state.compares.length > 0) {

      check.date = this.state.compares[0].date;

      if (this.state.compares[0].resultig >= 0) {

        check.checkig = '+'
      } else {
        check.checktextig = 'align-middle text-danger'
      }

      if (this.state.compares[0].result >= 0) {

        check.checkfb = '+'
      } else {
        check.checktextfb = 'align-middle text-danger'

      }

    }



    if (loading) {
      return (
        <Center>
          <div className="col-centered">


            <PropagateLoader

              sizeUnit={"px"}
              size={30}
              color={'#36D7B7'}
              loading={this.state.loading}
            />
          </div>

        </Center>
      )
    }




    return (
      <div className="App">

        <ul class="bubbles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>

        </ul>






        <Fade bottom>

        <div class="screenshot">
          <footer class="bg-info  text-light">

            <div class="footer-copyright  py-3 text-left align-middle"> <h5 class="mt-2 ml-3"> <b> KHAMIN STATS AT  {check.date} </b></h5>
            </div>

          </footer>
          <div class="divspace">
          </div>

          <Table class="table">
            <thead>
              <tr class="bg-light">

                <th class="align-middle"><h4>PROFILE</h4></th>
                <th class="align-middle"><h4>NAME</h4></th>
                <th><SocialIcon url="https://www.facebook.com/bnk48official.khamin/" /></th>
                <th><SocialIcon url="https://www.instagram.com/khamin.bnk48official/" /></th>
              </tr>
            </thead>
            <tbody>
              {this.state.compares.map(res =>
                <tr key={res.id}>
                  <td> <img src={res.picture} class=" img-thumbnail" height="300" width="300"></img></td>

                  <td class="align-middle"><h4> KHAMIN BNK48 </h4></td>

                  <td class="align-middle " ><h4 class={check.checktextfb}>{res.today} ({check.checkfb}{res.result})</h4> </td>

                  <td class="align-middle"><h4 class={check.checktextig}>{res.todayig} ({check.checkig}{res.resultig}) </h4></td>


                </tr>
              )}
            </tbody>
          </Table>
          <div class="divspace">
          </div>
          <footer class="bg-info  text-light">

            <div class="footer-copyright text-right py-3 mr-3 align-middle"><h5>KHAMIN THAILAND FANCLUB : KHAMINGARDEN.COM</h5>
            </div>

          </footer>
        </div>

          <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#home">KHAMIN-BNK48 STATS.</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
           

              </Nav>

              <Button variant="outline-success btn-sm" onClick={this.handleClick} > <span class="glyphicon glyphicon-align-left" aria-hidden="true">    <FontAwesomeIcon icon={faSync} /> RELOAD</span></Button>

            </Navbar.Collapse>
          </Navbar>

          <Row class="ml-3">
            <Col>
              <hr />
              <h5 class="align-middle mt-2" ><SocialIcon url="https://www.facebook.com/bnk48official.khamin/" /> Facebook Daily & Weekly</h5>

              <hr />

              <Table class="table table-hover">
                <thead>
                  <tr class="bg-primary text-light">

                    <th>Profile</th>
                    <th>Name</th>
                    <th>Stat</th>
                    <th>Growth</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.compares.map(res =>
                    <tr key={res.id}>
                      <td> <img src={res.picture} class=" img-thumbnail" height="80" width="80"></img></td>

                      <td class="align-middle"> Khamin Bnk48 </td>

                      <td class="align-middle">{res.today}</td>



                      <If condition={res.result > -1}>
                        <Then>
                          <td class="align-middle text-success" >+{res.result}</td>
                        </Then>

                        <Else>
                          <td class="align-middle text-danger" >{res.result}</td>
                        </Else>
                      </If>

                    </tr>
                  )}
                </tbody>
              </Table>







              <Table striped bordered hover size="sm">
                <thead>
                  <tr>

                    <th>Date</th>
                    <th>Stat</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.stats.map(stat =>
                    <tr key={stat.id}>
                      <td>{stat.date.substring(0, 10)}</td>
                      <td>{stat.stats}</td>

                    </tr>
                  )}
                </tbody>
              </Table>
            </Col>
            <Col>
              <hr />
              <h5 class="align-middle mt-2" ><SocialIcon url="https://www.instagram.com/khamin.bnk48official/" /> Instragram Daily & Weekly</h5>

              <hr />
              <Table class="table table-hover">
                <thead>
                  <tr class="text-light bg-info">
                    <th>Profile</th>
                    <th>Name</th>
                    <th>Stat</th>
                    <th>Growth</th>
                  </tr>
                </thead>
                <tbody >
                  {this.state.compares.map(res =>
                    <tr key={res.id}>
                      <td class="white-bg"> <img src={res.picture} class=" img-thumbnail" height="80" width="80"></img></td>
                      <td class="align-middle"> Khamin Bnk48 </td>

                      <td class="align-middle">{res.todayig}</td>



                      <If condition={res.resultig > -1}>
                        <Then>
                          <td class="align-middle text-success" >+{res.resultig}</td>
                        </Then>

                        <Else>
                          <td class="align-middle text-danger" >{res.resultig}</td>
                        </Else>
                      </If>

                    </tr>
                  )}
                </tbody>
              </Table>


              <Table striped bordered hover size="sm">
                <thead>
                  <tr>

                    <th>Date</th>
                    <th>Stat</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.statsig.map(stat =>
                    <tr key={stat.id}>
                      <td>{stat.date.substring(0, 10)}</td>
                      <td>{stat.stats}</td>

                    </tr>
                  )}
                </tbody>
              </Table>

            </Col>


          </Row>




     
          


                        <Chart chartData={this.state.chartData} location='Facebook' legendPosition="bottom" />
                       

                        <Chart chartData={this.state.chartDataIG} location='Instragram' legendPosition="bottom" />                        
                  


        </Fade>

        
        
      </div>
    );
  }
}

export default App;
