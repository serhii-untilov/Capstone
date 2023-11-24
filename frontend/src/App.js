// import Component from the react module
import React from "react"
import Sidenav from "./components/Sidenav"
import { BrowserRouter } from "react-router-dom"
import Router from "./router/Router"
import { AuthProvider } from "./context/AuthContext"
import { UserProvider } from "./context/UserContext"
import { CompanyProvider } from "./context/CompanyContext"

function App() {
	return (
		<AuthProvider>
			<UserProvider>
				<CompanyProvider>
					<BrowserRouter>
						<main className="mx-auto h-100 w-100 row bg-light">
							<div className="col-xl-10 col-lg-12 row h-100 mx-auto">
								<Sidenav className="col-xl-2 col-lg-3 col-md-4 col-sm-4  bg-light" />
								{/* <div className="col-sm-8 col-lg-10 h-100 mx-0 ps-0 bg-body-secondary"> */}
								<div className="col-xl-10 col-lg-9 col-md-8 col-sm-8 col-lg-10 h-100 m-0 p-0 bg-light">
									<Router />
								</div>
							</div>
						</main>
					</BrowserRouter>
				</CompanyProvider>
			</UserProvider>
		</AuthProvider>
	)
}

export default App;
