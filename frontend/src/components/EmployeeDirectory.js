import {Col, Form, Row} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'
import {useQuery} from '@apollo/client'
import React, {useState, useEffect} from 'react'

import {
	GET_EMPLOYEE_BY_EMPLOYEE_TYPE,
	GET_EMPLOYEE_LIST_QUERY,
} from '../graphql/Queries'
import Cards from './Cards'
import LoadingSpinner from './LoadingSpinner'

const EmployeeDirectory = () => {
	const navigate = useNavigate()
	// Get all employees
	const [employeeList, setEmployeeList] = useState([])
	const {loading, error, data} = useQuery(GET_EMPLOYEE_LIST_QUERY)

	const [searchType, setSearchType] = useState('All')
	const [searchText, setSearchText] = useState('')

	const handleTypeChange = (event) => {
		setSearchType(event.target.value)
		if (event.target.value === 'All') {
			setEmployeeList(data.getAllEmployee)
		} else {
			setEmployeeList(
				data.getAllEmployee.filter(
					(employee) => employee.employeeType === event.target.value
				)
			)
		}
	}

	const handleSearch = (event) => {
		setSearchText(event.target.value)
		if (event.target.value === '') {
			setEmployeeList(data.getAllEmployee)
		} else {
			setEmployeeList(
				data.getAllEmployee.filter(
					(employee) =>
						employee.firstName
							.toLowerCase()
							.includes(event.target.value.toLowerCase()) ||
						employee.lastName
							.toLowerCase()
							.includes(event.target.value.toLowerCase())
				)
			)
		}
	}

	useEffect(() => {
		if (data) {
			setEmployeeList(data.getAllEmployee)
		}
	}, [data])

	if (loading) return <LoadingSpinner />
	// If error occurs console log the error
	if (error) console.log('--> Error :', error)

	return (
		<>
			<Row>
				<Col>
					<Form.Group className='mb-3' controlId='formBasicEmail'>
						<Form.Label>Search</Form.Label>
						<Form.Control
							type='text'
							placeholder='Search for Employee by name'
							value={searchText}
							onChange={handleSearch}
						/>
					</Form.Group>
				</Col>
				<Col>
					<div>
						<Form.Group
							className='mb-3'
							controlId='formBasicPassword'
						>
							<Form.Label>Select Employee Type:</Form.Label>
							<Form.Select
								aria-label='Default select example'
								value={searchType}
								onChange={handleTypeChange}
							>
								<option value='All'>All Employees</option>
								<option value='Full-time'>
									Full Time Employees
								</option>
								<option value='Part-time'>
									Part Time Employees
								</option>
								<option value='Contract'>
									Contract Employees
								</option>
								<option value='Seasonal'>
									Seasonal Employees
								</option>
							</Form.Select>
						</Form.Group>
					</div>
				</Col>
			</Row>
			<Row>
				{employeeList.length > 0 ? (
					employeeList.map((employee) => (
						<Col
							key={employee.id}
							onClick={() => {
								navigate(`/employee-list/${employee.id}`)
							}}
						>
							<Cards employee={employee} />
						</Col>
					))
				) : (
					<p>No employee found</p>
				)}
			</Row>
		</>
	)
}

export default EmployeeDirectory
