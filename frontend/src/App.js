import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';



function App() {

	const [title, setTitle] = useState('');
	const [sources, setSources] = useState([]);
	const [url, setUrl] = useState('');
	
	const getData = async( ) => {
		try{
			const response = await fetch(`http://localhost:8000/article`)
			const json = await response.json()
		} catch (err) {
			console.error(err)
		}
	}
	
	const postData = async (data) => {
		console.log(data)
		try{
			const response = await fetch(`http://localhost:8000/article`, {
			method: "POST",
			header: {'Content-Type': 'application/json'},
			body: JSON.stringify(data)
			})
		} catch (err) {
			console.error(err)
		}
	}

	useEffect(() => getData, [])

	const checkdb = async (url) => {
		try{
			const response = await fetch(`http://localhost:8000/url/${encodeURIComponent(url)}`)
			const json = await response.json()
		}catch (err){
			console.error(err)
		}
	}

	const getSources = async () => {
		try {
			const urlNode = await checkdb(url)
			if(!urlNode){
				const response = await axios.get(`http://localhost:4000/article/${encodeURIComponent(url)}`);
				const data = response?.data;
				if (!data) return;
				const newData = {url: url, title: data.title}
				postData(newData)
				setSources(data.sources);
				setTitle(data.title);
			}
		} catch (error) {
			console.error("Error fetching data:", error);
			if (error.response) {
			  console.log(error.response.data);
			  console.log(error.response.status);
			  console.log(error.response.headers);
			} else if (error.request) {
			  console.log(error.request);
			} else {
			  console.log('Error', error.message);
			}
		}

	}

	const handleSubmit = (e) => {
		e.preventDefault();
		getSources();
	  }

	return (
		<div className="App">
			<Navbar className="bg-body-tertiary justify-content-between">
				<Form onSubmit={handleSubmit} className="w-100 mx-0">
					<Row className="w-100 mx-0">
						<Col className="w-100">
							<Form.Control
								type="text"
								placeholder="Search"
								className="w-100"
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
			<h1> {title}</h1>
			<br></br>
			{sources.length ? 
				<div>
					{sources.map((source, index) => (
						<div key={index}>
							<h3>{source.sentence}</h3>
							<a href={source.url}>{source.url}</a>
						</div>
					))}
				</div>
			: ''}
		</div>
	);
}

export default App;
