import React, { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import Accordion from 'react-bootstrap/Accordion';
import DatePicker from "react-multi-date-picker";
import DataGridComponent from './DataGridComponent';


function DataDisplayComponent() {
    // Query Result
    const [resultData, setResultData] = useState([]);
    const [gridData, setGridData] = useState([]);
    const [pageLimit, setPageLimit] = useState(4);
    const [offSet, setOffSet] = useState(0);
    const offSetRef = useRef(0);
    const previousPageRef = useRef(true);

    // Modal state variables
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Rerender on GridData change
    useEffect(() => {
        if (offSetRef.current == 0) {
            setGridData(resultData)
            previousPageRef.current = true
        }
        else {
            previousPageRef.current = false
            setGridData(resultData.slice(offSetRef.current, resultData.length))
        }
    }, [resultData])


    // SexAtBirth
    const sexAtBirthOptions = [
        { value: 'M', label: 'Male' },
        { value: 'F', label: 'Female' },
        { value: 'T', label: 'Other' }
    ]
    const [sexAtBirthChosen, setSexAtBirthChosen] = useState([]);
    function handleSexAtBirthOnChange(e) {
        setSexAtBirthChosen(formatMultiSelectDropDown(e));
    }

    // Ethnicity
    const ethnicityOptions = [
        { value: 'Black African', label: 'Black African' },
        { value: 'Caribbean', label: 'Caribbean' },
        { value: 'White British', label: 'White British' },
        { value: 'Other Mixed', label: 'Other Mixed' },
        { value: 'Asian Mixed', label: 'Asian Mixed' },
        { value: 'Chinese', label: 'Chinese' },
        { value: 'Other White', label: 'Other White' }
    ]
    const [ethnicityChosen, setEthnicityChosen] = useState([]);
    function handleEthnicityOnChange(e) {
        setEthnicityChosen(formatMultiSelectDropDown(e));
    }

    // Year of Birth
    const [valueDOBDateRangeStart, setValueDOBDateRangeStart] = useState(null);
    const [valueDOBDateRangeEnd, setValueDOBDateRangeEnd] = useState(null);
    const [dobDateRange, setDOBDateRange] = useState("");
    useEffect(() => {
        let dobDateRange = `"${formatDateYearValue(valueDOBDateRangeStart)}","${formatDateYearValue(valueDOBDateRangeEnd)}"`
        setDOBDateRange(dobDateRange)
    }, [valueDOBDateRangeStart, valueDOBDateRangeEnd])

    // Admission Start Date
    const [valueAdmissionStartDateRangeStart, setValueAdmissionStartDateRangeStart] = useState(null);
    const [valueAdmissionStartDateRangeEnd, setValueAdmissionStartDateRangeEnd] = useState(null);
    const [admissionStartDateRange, setAdmissionStartDateRange] = useState("");
    useEffect(() => {
        let admissionStartDateRange = `"${formatDateValue(valueAdmissionStartDateRangeStart)}","${formatDateValue(valueAdmissionStartDateRangeEnd)}"`
        setAdmissionStartDateRange(admissionStartDateRange)
    }, [valueAdmissionStartDateRangeStart, valueAdmissionStartDateRangeEnd])

    // Admission End Date
    const [valueAdmissionEndDateRangeStart, setValueAdmissionEndDateRangeStart] = useState(null);
    const [valueAdmissionEndDateRangeEnd, setValueAdmissionEndDateRangeEnd] = useState(null);
    const [admissionEndDateRange, setAdmissionEndDateRange] = useState("");
    useEffect(() => {
        let admissionEndDateRange = `"${formatDateValue(valueAdmissionEndDateRangeStart)}","${formatDateValue(valueAdmissionEndDateRangeEnd)}"`
        setAdmissionEndDateRange(admissionEndDateRange)
    }, [valueAdmissionEndDateRangeStart, valueAdmissionEndDateRangeEnd])

    // Admission Source
    const admissionSourceOptions = [
        { value: 'Inpatient', label: 'Inpatient' },
        { value: 'Outpatient', label: 'Outpatient' },
        { value: 'Psychiatric', label: 'Psychiatric' },
        { value: 'ICU', label: 'ICU' }
    ]
    const [admissionSourceChosen, setAdmissionSourceChosen] = useState([]);
    function handleAdmissionSourceOnChange(e) {
        setAdmissionSourceChosen(formatMultiSelectDropDown(e));
    }

    // Admission Outcome
    const admissionOutComeOptions = [
        { value: 'Discharged Alive', label: 'Discharged Alive' },
        { value: 'Unknown', label: 'Unknown' },
        { value: 'Inpatient', label: 'Inpatient' },
        { value: 'Hospice', label: 'Hospice' },
        { value: 'Psychiatric', label: 'Psychiatric' },
        { value: 'ICU', label: 'ICU' }
    ]
    const [admissionOutComeChosen, setAdmissionOutComeChosen] = useState([]);
    function handleAdmissionOutComeOnChange(e) {
        setAdmissionOutComeChosen(formatMultiSelectDropDown(e));
    }


    // Util
    function formatMultiSelectDropDown(e) {
        return e.map(value => value.value).map(v => `"${v}"`).join(',')
    }
    const formatDateValue = (dateValue) => {
        if (dateValue != null) {
            let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(dateValue);
            let month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(dateValue);
            let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(dateValue);
            return (`${year}-${month}-${day}`);
        }
        return "";
    }
    const formatDateYearValue = (dateValue) => {
        if (dateValue != null) {
            let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(dateValue);
            return (`${year}`);
        }
        return "";
    }

    // Query Trigger
    function handleFetch() {
        
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain', 'Accept': '*/*' },
            body: graphQlBody()
        };
        console.log(offSetRef.current)
        fetch(URL, requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.data == null || data.data == []) {
                    alert('No matching data found')
                }
                else {
                    setShow(true);
                    setResultData(previousResult => {
                        return [...previousResult, ...data.data.nhsData]
                    })
                }
            });
    }

    function handleNextPage() {
        offSetRef.current = resultData.length
        if (offSetRef.current >= resultData.length - pageLimit) {
            console.log(offSetRef.current)
            handleFetch()
        }
        else {
            console.log(offSetRef.current)
            offSetRef.current = offSetRef.current + pageLimit
        }

    }

    function handlePreviousPage() {
        console.log(offSetRef.current)
        let sliceStart = offSetRef.current - pageLimit
        offSetRef.current = sliceStart
        if (offSet.current == 0) {
            previousPageRef.current = true
        }
        resultData.slice(sliceStart, resultData.length - pageLimit)
        setGridData(resultData.slice(sliceStart, resultData.length - pageLimit))
    }

    // GraphQL
    const URL = 'http://localhost:8080/nhs-directory-service/api/query-nhs'
    const graphQlBody = () => `
  {
    nhsData(
    patientIdList: [],
    yearOfBirthList: [${dobDateRange}],
    sexAtBirthList: [${sexAtBirthChosen}],
    ethnicityList: [${ethnicityChosen}],
    admissionStartDateList: [${admissionStartDateRange}],
    admissionEndDateList: [${admissionEndDateRange}],
    admissionSourceList: [${admissionSourceChosen}],
    admissionOutComeList: [${admissionOutComeChosen}],
    offSet: "${offSetRef.current}"
    ){
        patientId
        yearOfBirth
        sexAtBirth
        ethnicity
        admissionStartDateTime
        admissionEndDateTime
        admissionSource
        admissionOutcome
    }
}
`

    return (
        <>
            <div className="App">
                <nav className="navbar navbar-expand-lg navbar-light fixed-top">
                    <div className="container">
                        <label className='label-nav'>NHS Query Tool</label>
                        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                        </div>
                    </div>
                </nav>

                <div className="auth-wrapper">
                    <div className="auth-inner">
                        <form>
                            <h3>Query</h3>
                            <div className="form-group">
                                <Accordion>
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>Birth Date</Accordion.Header>
                                        <Accordion.Body>
                                            <div className="form-group">
                                                <label>Choose DOB range</label><br />
                                                <DatePicker onChange={setValueDOBDateRangeStart} value={valueDOBDateRangeStart} placeholder='dob range start' />
                                                <DatePicker onChange={setValueDOBDateRangeEnd} value={valueDOBDateRangeEnd} placeholder='dob range end' />
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="1">
                                        <Accordion.Header>Sex at Birth</Accordion.Header>
                                        <Accordion.Body>
                                            <div className="form-group">
                                                <label>Choose gender</label>
                                                <Select isMulti name="sexAtBirth" options={sexAtBirthOptions} onChange={handleSexAtBirthOnChange} className="basic-multi-select" classNamePrefix="select" />
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="2">
                                        <Accordion.Header>Ethnicity</Accordion.Header>
                                        <Accordion.Body>
                                            <div className="form-group">
                                                <label>Choose ethnicity</label>
                                                <Select isMulti name="ethnicity" options={ethnicityOptions} onChange={handleEthnicityOnChange} className="basic-multi-select" classNamePrefix="select" />
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="3">
                                        <Accordion.Header>Admission Start Date</Accordion.Header>
                                        <Accordion.Body>
                                            <div className="form-group">
                                                <label>Choose Admission Start Date Range</label><br />
                                                <DatePicker onChange={setValueAdmissionStartDateRangeStart} value={valueAdmissionStartDateRangeStart} placeholder='admission begin range start' />
                                                <DatePicker onChange={setValueAdmissionStartDateRangeEnd} value={valueAdmissionStartDateRangeEnd} placeholder='admission begin range end' />
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="4">
                                        <Accordion.Header>Admission End Date</Accordion.Header>
                                        <Accordion.Body>
                                            <div className="form-group">
                                                <label>Choose Admission End Date Range</label><br />
                                                <DatePicker onChange={setValueAdmissionEndDateRangeStart} value={valueAdmissionEndDateRangeStart} placeholder='admission end range start' />
                                                <DatePicker onChange={setValueAdmissionEndDateRangeEnd} value={valueAdmissionEndDateRangeEnd} placeholder='admission end range end' />
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="5">
                                        <Accordion.Header>Admission Source</Accordion.Header>
                                        <Accordion.Body>
                                            <div className="form-group">
                                                <label>Choose Admission Source</label>
                                                <Select isMulti name="admissionSource" options={admissionSourceOptions} onChange={handleAdmissionSourceOnChange} className="basic-multi-select" classNamePrefix="select" />
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    <Accordion.Item eventKey="6">
                                        <Accordion.Header>Admission Outcome</Accordion.Header>
                                        <Accordion.Body>
                                            <div className="form-group">
                                                <label>Choose Admission Outcome</label>
                                                <Select isMulti name="admissionOutcome" options={admissionOutComeOptions} onChange={handleAdmissionOutComeOnChange} className="basic-multi-select" classNamePrefix="select" />
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                            </div>
                           <Button variant="primary" style={{width:'100%'}} onClick={handleFetch}>Fetch Data</Button>
                        </form>
                    </div>
                </div>
            </div>

            <Modal show={show} onHide={handleClose} style={{ width: '100%', position: 'fixed' }}>
                <Modal.Header closeButton>
                    <Modal.Title>Query Data</Modal.Title>
                </Modal.Header>
                <Modal.Body><DataGridComponent resultData={gridData} /></Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" disabled={previousPageRef.current} onClick={handlePreviousPage}>
                        Previous Page
                    </Button>
                    <Button variant="primary" onClick={handleNextPage}>
                        Next Page
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default DataDisplayComponent;
