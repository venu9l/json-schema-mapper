/**
 * Array Filtering Example
 * Demonstrates using [key=value] syntax to filter arrays
 */

const { map } = require('../src/index');

const sourceData = {
  patients: [
    {
      id: 1,
      clinical: [
        { key: 'name', value: 'John Doe' },
        { key: 'age', value: '32' },
        { key: 'diagnosis', value: 'Hypertension' }
      ]
    },
    {
      id: 2,
      clinical: [
        { key: 'name', value: 'Jane Smith' },
        { key: 'age', value: '28' },
        { key: 'diagnosis', value: 'Diabetes' }
      ]
    }
  ]
};

const schema = {
  patient_id: {
    path: 'patients.*.id',
    transform: 'toNumber'
  },
  name: {
    path: 'patients.*.clinical[key=name].value'
  },
  age: {
    path: 'patients.*.clinical[key=age].value',
    transform: 'toNumber'
  },
  diagnosis: {
    path: 'patients.*.clinical[key=diagnosis].value'
  }
};

const result = map(sourceData, schema);

console.log('Array Filtering Example:');
console.log(JSON.stringify(result, null, 2));

