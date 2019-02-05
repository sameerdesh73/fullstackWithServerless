import React, { Component } from "react";
import { FormGroup, FormControl } from "react-bootstrap";
import config from "../config";

export default class NewLead extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        jobSearchId: "1",
        company: "Glassdoor",
        jobTitle: "Director",
        leadId: null
      };
    }

    handleChange = event => {
        this.setState({
          [event.target.id]: event.target.value
        });
      }

    handleSubmit = async event => {
        event.preventDefault();

        var lead = {
            jobSearchId: this.state.jobSearchId,
            company: this.state.company,
            jobTitle: this.state.jobTitle
        }

        var bearerToken = 'Bearer ' + this.props.auth.idToken;
        console.log('bearerToken: ' + bearerToken);
        console.log('JOBSEARCH_API_URL: ' + config.JOBSEARCH_API_URL);

        fetch (config.JOBSEARCH_API_URL, {
            method: 'Post',
            mode: 'cors',
            headers: {
                 'Authorization': bearerToken,
                 'x-api-key': config.JOBSEARCH_API_KEY
            },
            body: JSON.stringify(lead)
        }).then(function (response) {
            return response.json(); //response.json() is resolving its promise. It waits for the body to load
        }).then( (responseData) => {
            //Do your logic
            console.log(responseData);
            this.setState({leadId: responseData.leadId});
        });        
    }

    render() {
        return (
          <div className="NewNote">
            <form onSubmit={this.handleSubmit}>
            <FormGroup controlId="jobSearchId">
                jobSearchId
                <FormControl
                    type="text"
                    value={this.state.jobSearchId} 
                    onChange={this.handleChange}
                />
            </FormGroup>
            <FormGroup controlId="company">
                Company
                <FormControl
                    type="text"
                    value={this.state.company} 
                    onChange={this.handleChange}
                />
            </FormGroup>
            <FormGroup controlId="jobTitle">
                jobTitle
                <FormControl
                    type="text"
                    value={this.state.jobTitle} 
                    onChange={this.handleChange}
                />
            </FormGroup>          
            <input type="submit" value="Submit" />
            <br/>
            LeadId: {this.state.leadId}
            </form>
          </div>
        );
    }
        
}