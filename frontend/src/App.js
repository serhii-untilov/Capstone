// import Component from the react module
import React, { Component } from "react";
import Sidenav from "./components/Sidenav"
import axios from 'axios';
import { BrowserRouter as Router } from "react-router-dom";
import Routes from "./Routes"

axios.defaults.baseURL = "http://localhost:8000/api/"

class App extends Component {
	// Start by visual effects to viewer
	render() {
		return (
			<Router>
				<main className="container-fluid h-100 bg-body-secondary">
					<div className="row h-100 w-100">
						<Sidenav className="col-sm-4 col-lg-2" />
						<div className="col-sm-8 col-lg-10 h-100">
							<Routes />
						</div>
					</div>
				</main>
			</Router>
		);
	}
}
export default App;
