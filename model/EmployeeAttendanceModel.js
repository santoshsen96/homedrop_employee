const Realm = require('realm');

class EmployeeAttendanceModel extends Realm.Object {
    static schema = {
     name: 'EmployeeAttendanceModel',
     primaryKey: '_id',
     properties: {
       _id: 'uuid', 
       store_id: 'string',
       employee_id: 'string',
       date_created: 'double',//double
       date_updated:{ type: 'double', optional: true },
       value: 'string',
       remarks: 'string',
     },
   };
}

module.exports = EmployeeAttendanceModel;