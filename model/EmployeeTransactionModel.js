const Realm = require('realm');

class EmployeeTransactionModel extends Realm.Object {
    static schema = {
     name: 'EmployeeTransactionModel',
     primaryKey: '_id',
     properties: {
       _id: 'uuid',
       store_id: 'string',
       employee_id: 'string',
       date_created: 'double',//double
       date_updated:{ type: 'double', optional: true },
       type: 'string', // Should be one of 'SALARY', 'BONUS', 'ADVANCE', or 'LOAN'
       transaction_type: 'string', // Should be one of 'CREDIT' or 'DEBIT'
       remarks: 'string',
     },
   }
   }

module.exports = EmployeeTransactionModel;