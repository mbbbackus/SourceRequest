import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Diagram from './Diagram.js';

function App() {

	const [title, setTitle] = useState('');
	const [sources, setSources] = useState([]);
	const [url, setUrl] = useState('');

	const getSources = async () => {
		try {
			const response = await axios.get(`http://localhost:8000/article/${encodeURIComponent(url)}`);
			const data = response?.data;
			if (!data) return;				
			setSources(data.sources);
			setTitle(data.title);
		} catch (error) {
			console.error("Error fetching data:", error);
		}

	}

	const handleSubmit = (e) => {
		e.preventDefault();
		getSources();
	}

	return (
		<div className="App" style={{ height: '100%' }}>
			<Navbar className="bg-body-dark justify-content-between">
				<Form onSubmit={handleSubmit} className="w-100 mx-0y">
					<Row className="w-100 mx-0">
						<Col className="w-100">
							<Form.Control
								type="text"
								placeholder="Search"
								className="w-100 bg-body-tertiar"
								value={url}
								onChange={(e) => setUrl(e.target.value)}
							/>
						</Col>
						<Col xs={2} sm={1} className="px-0">
							<Button type="submit" onClick={getSources}>Submit</Button>
						</Col>
					</Row>
				</Form>
			</Navbar>
			<div style={{ height: '100%' }}>
				<Diagram sources={sources} title={title} url={url}></Diagram>
			</div>
		</div>
	);
}

export default App;
