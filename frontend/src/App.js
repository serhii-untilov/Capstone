// import Component from the react module
import React from "react"
import Sidenav from "./components/Sidenav"
import { BrowserRouter } from "react-router-dom"
import Router from "./router/Router"
import { AuthProvider } from "./context/AuthContext"
import { UserProvider } from "./context/UserContext"

function App() {
	return (
		<AuthProvider>
			<UserProvider>
				<BrowserRouter>
					<main className="container-fluid h-100 bg-body-secondary">
						<div className="row h-100 w-100">
							<Sidenav className="col-sm-4 col-lg-2" />
							<div className="col-sm-8 col-lg-10 h-100">
								<Router />
							</div>
						</div>
					</main>
				</BrowserRouter>
			</UserProvider>
		</AuthProvider>
	)
}

export default App;
