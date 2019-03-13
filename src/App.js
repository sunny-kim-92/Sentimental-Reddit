import React, { Component } from "react";
import "./App.css";
import { Jumbotron } from "react-bootstrap";
import Analysis from "./Analysis";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      showAnalysis: false,
      value: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleURLSubmit = this.handleURLSubmit.bind(this);
    this.handleResetSubmit = this.handleResetSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleURLSubmit(event) {
    event.preventDefault();
    // alert('A name was submitted: ' + this.state.value);
    this.setState({
      showAnalysis: true,
      url: this.state.value
    });
  }

  handleResetSubmit(event) {
    event.preventDefault();
    this.setState({
      url: "",
      showAnalysis: false
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Reddit Sentiment!</h1>
        </header>
        <Jumbotron>
          <h2 className="App-intro">
            <form onSubmit={this.handleURLSubmit}>
              <label>
                Please Enter a Subreddit URL:
                <input
                  type="text"
                  value={this.state.value}
                  onChange={this.handleChange}
                />
              </label>
              <input
                type="submit"
                value="Submit"
                onSubmit={this.handleURLSubmit}
              />
            </form>
          </h2>
        </Jumbotron>

        {this.state.showAnalysis ? <Analysis url={this.state.url} /> : null}
        <form onSubmit={this.handleResetSubmit}>
          <input
            type="submit"
            value="Reset Data"
            onSubmit={this.handleResetSubmit}
          />
        </form>
      </div>
    );
  }
}

export default App;

