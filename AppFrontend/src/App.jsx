import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { useState } from 'react'
import { Login } from './assets/Login';
import { Register } from './assets/Register';
import { Home } from './assets/Home';
import { AccountDashboard } from './assets/AccountDashboard';

import './App.css'

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Navigate to="/login" />} />
				
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/home" element={<Home />} />
				<Route path="/account-dashboard/:id" element={<AccountDashboard />} />				
			</Routes>
		</Router>
	);
}

export default App
