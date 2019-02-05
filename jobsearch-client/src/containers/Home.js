import React, { Component } from "react";
//import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { PageHeader, ListGroup, ListGroupItem } from "react-bootstrap";
import config from "../config";
import "./Home.css";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      jobSearchId: null,
      leads: []
    };
  }

  async componentDidMount() {
    try {
      var bearerToken = "Bearer " + this.props.auth.idToken;

      const response = await fetch(config.JOBSEARCH_API_URL, {
        method: "Get",
        mode: "cors",
        headers: {
          Authorization: bearerToken,
          "x-api-key": config.JOBSEARCH_API_KEY
        }
      });
      const responseData = await response.json();
      this.setState({
        jobSearchId: responseData.jobSearchId,
        leads: responseData.leads
      });
    } catch (e) {
      console.log('Error getting leads data: ' + e)
    }

    this.setState({ isLoading: false });
  }
  // get jobSearchId and leads, store jobSearchId under state
  // render leads and provide Add new button

  renderleadsList(leads) {
    return [{}].concat(leads).map(
      (lead, i) =>
        i !== 0
          ? <LinkContainer
              key={lead.leadId}
              to={`/leads/${lead.leadId}`}
            >
              <ListGroupItem header={lead.company}>
                {"Job Title: " + lead.jobTitle}
              </ListGroupItem>
            </LinkContainer>
          : <LinkContainer
              key="new"
              to="/leads/new"
            >
              <ListGroupItem>
                <h4>
                  <b>{"\uFF0B"}</b> Create a new lead
                </h4>
              </ListGroupItem>
            </LinkContainer>
    );
  }
  
  render() {
    return (
      <div className="leads">
        <PageHeader>Your leads</PageHeader>
        <ListGroup>
          {!this.state.isLoading && this.renderleadsList(this.state.leads)}
        </ListGroup>
      </div>
    );
  }
}
