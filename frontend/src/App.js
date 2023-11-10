// import Component from the react module
import React, { Component } from "react";
import Sidenav from "./components/Sidenav"
import axios from 'axios';
import {
	BrowserRouter as Router,
	Switch,
	Route
} from "react-router-dom";
import Login from "./components/Login"
import Register from "./components/Register"
import Company from "./components/Company"
import RegisterCompany from "./components/RegisterCompany"
import Profile from "./components/Profile"
import Dashboard from "./components/Dashboard"
import Staff from "./components/Staff"
import Employees from "./components/Employees"
import PayrollSheet from "./components/PayrollSheet"
import PersonalCard from "./components/PersonalCard"
import Payroll from "./components/Payroll"
import Settings from "./components/Settings"
import Language from "./components/Language"
import Logout from "./components/Logout"
import Home from "./components/Home"

class App extends Component {

	// add a constructor to take props
	constructor(props) {
		super(props);

		// add the props here
		this.state = {

			// the viewCompleted prop represents the status
			// of the task. Set it to false by default
			viewCompleted: false,
			activeItem: {
				title: "",
				description: "",
				completed: false
			},

			// this list stores all the completed tasks
			taskList: []
		};
	}

	// Add componentDidMount()
	componentDidMount() {
		this.refreshList();
	}


	refreshList = () => {
		axios //Axios to send and receive HTTP requests
			.get("http://localhost:8000/api/tasks/")
			.then(res => this.setState({ taskList: res.data }))
			.catch(err => console.log(err));
	};

	// this arrow function takes status as a parameter
	// and changes the status of viewCompleted to true
	// if the status is true, else changes it to false
	displayCompleted = status => {
		if (status) {
			return this.setState({ viewCompleted: true });
		}
		return this.setState({ viewCompleted: false });
	};

	// this array function renders two spans that help control
	// the set of items to be displayed(ie, completed or incomplete)
	renderTabList = () => {
		return (
			<div className="my-5 tab-list">
				<span
					onClick={() => this.displayCompleted(true)}
					className={this.state.viewCompleted ? "active" : ""}
				>
					completed
				</span>
				<span
					onClick={() => this.displayCompleted(false)}
					className={this.state.viewCompleted ? "" : "active"}
				>
					Incompleted
				</span>
			</div>
		);
	};
	// Main variable to render items on the screen
	renderItems = () => {
		const { viewCompleted } = this.state;
		const newItems = this.state.taskList.filter(
			(item) => item.completed === viewCompleted
		);
		return newItems.map((item) => (
			<li
				key={item.id}
				className="list-group-item d-flex justify-content-between align-items-center"
			>
				<span
					className={`todo-title mr-2 ${this.state.viewCompleted ? "completed-todo" : ""
						}`}
					title={item.description}
				>
					{item.title}
				</span>
				<span>
					<button
						onClick={() => this.editItem(item)}
						className="btn btn-secondary mr-2"
					>
						Edit
					</button>
					<button
						onClick={() => this.handleDelete(item)}
						className="btn btn-danger"
					>
						Delete
					</button>
				</span>
			</li>
		));
	};

	toggle = () => {
		//add this after modal creation
		this.setState({ modal: !this.state.modal });
	};


	// Submit an item
	handleSubmit = (item) => {
		this.toggle();
		alert("save" + JSON.stringify(item));
		if (item.id) {
			// if old post to edit and submit
			axios
				.put(`http://localhost:8000/api/tasks/${item.id}/`, item)
				.then((res) => this.refreshList());
			return;
		}
		// if new post to submit
		axios
			.post("http://localhost:8000/api/tasks/", item)
			.then((res) => this.refreshList());
	};

	// Delete item
	handleDelete = (item) => {
		alert("delete" + JSON.stringify(item));
		axios
			.delete(`http://localhost:8000/api/tasks/${item.id}/`)
			.then((res) => this.refreshList());
	};

	// Create item
	createItem = () => {
		const item = { title: "", description: "", completed: false };
		this.setState({ activeItem: item, modal: !this.state.modal });
	};

	//Edit item
	editItem = (item) => {
		this.setState({ activeItem: item, modal: !this.state.modal });
	};

	// Start by visual effects to viewer
	render() {
		return (
			<Router>
				<main className="container-fluid h-100">
					<div className="row h-100 w-100">
						<Sidenav className="col-sm-4 col-lg-2" />
						<div className="col-sm-8 col-lg-10">
							<Switch>
								{/* <Route path="/login"><Login /></Route> */}
								<Route path="/login" exact component={Login} />
								<Route path="/register" exact component={Register} />
								<Route path="/company" exact component={Company} />
								<Route path="/register-company" exact component={RegisterCompany} />
								<Route path="/profile" exact component={Profile} />
								<Route path="/dashboard" exact component={Dashboard} />
								<Route path="/staff" exact component={Staff} />
								<Route path="/employees" exact component={Employees} />
								<Route path="/payroll-sheet" exact component={PayrollSheet} />
								<Route path="/personal-card" exact component={PersonalCard} />
								<Route path="/payroll" exact component={Payroll} />
								<Route path="/settings" exact component={Settings} />
								<Route path="/language" exact component={Language} />
								<Route path="/logout" exact component={Logout} />
								<Route path="/" exact component={Home} />
							</Switch>
						</div>
					</div>
				</main>
			</Router>
		);
	}
}
export default App;
