import DataGrid from 'react-data-grid';

const columns = [
  { key: 'patientId', name: 'Patient ID' },
  { key: 'yearOfBirth', name: 'Year Of Birth' },
  { key: 'sexAtBirth', name: 'Gender' },
  { key: 'ethnicity', name: 'Ethnicity' },
  { key: 'admissionStartDateTime', name: 'Admission Start' },
  { key: 'admissionEndDateTime', name: 'Admission End' },
  { key: 'admissionSource', name: 'Admission Source' },
  { key: 'admissionOutcome', name: 'Admission OutCome' }
];

const rows = [];

function DataGridComponent({resultData}) {
  return (
  <DataGrid columns={columns} rows={resultData} />
  );
}

export default DataGridComponent;