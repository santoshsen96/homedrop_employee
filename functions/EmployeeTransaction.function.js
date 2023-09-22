const Realm = require("realm");
const EmployeeTransactionModel = require("../model/EmployeeTransactionModel");
const getRealm = require("../getRealm");
const UUID = Realm.BSON.UUID;

function dateToDouble(date) {
  return date.getTime();
}

async function addEmployeeTransaction(data) {
  let realm;
  let createdTransaction = null;
  try {
    realm = await getRealm(EmployeeTransactionModel);
    realm.write(() => {
      createdTransaction = realm.create("EmployeeTransactionModel", {
        _id: new UUID(),
        store_id: data.store_id,
        employee_id: data.employee_id,
        date_created: dateToDouble(new Date()),
        date_updated: null,
        type: data.type,
        transaction_type: data.transaction_type,
        remarks: data.remarks,
      });
    });
    //console.log("Data added to Employee Transaction");
    return createdTransaction.toJSON();
  } catch (error) {
    console.error("Error adding data to EmployeeTransactionModel:", error);
  } finally {
    if (realm) {
      realm.close();
    }
  }
}

async function getEmployeeTransaction() {
  let realm;
  try {
    realm = await getRealm(EmployeeTransactionModel);

    const employeeTransactionRecords = realm
      .objects("EmployeeTransactionModel")
      .toJSON();

    //console.log(employeeTransactionRecords);
    return employeeTransactionRecords;
  } catch (error) {
    console.error(
      "Error retrieving data from EmployeeTransactionModel:",
      error
    );
    throw error;
  } finally {
    if (realm) {
      realm.close();
    }
  }
}

async function updateEmployeeTransaction(data) {
  let realm;
  try {
    realm = await getRealm(EmployeeTransactionModel);
    let updatedData = null;

    realm.write(() => {
      let existingData = realm.objectForPrimaryKey(
        "EmployeeTransactionModel",
        data._id
      );

      if (existingData) {
        existingData.remarks = data.remarks;
        existingData.date_updated = dateToDouble(new Date());
        existingData.type = data.type;
        existingData.transaction_type = data.transaction_type;
        updatedData = existingData;
      } else {
        console.error(
          "Employee transaction record not found for _id:",
          data._id
        );
      }
    });

    return updatedData.toJSON();
    //console.log("Data updated successfully in EmployeeTransactionModel");
  } catch (error) {
    console.error("Error updating data in EmployeeTransactionModel:", error);
  } finally {
    if (realm) {
      realm.close();
    }
  }
}

async function deleteEmployeeTransactionById(id) {
  let realm;
  try {
    realm = await getRealm(EmployeeTransactionModel);

    realm.write(() => {
      const existingData = realm.objectForPrimaryKey(
        "EmployeeTransactionModel",
        id
      );

      if (existingData) {
        realm.delete(existingData);
        console.log(`Employee transaction record with _id ${id} deleted.`);
      } else {
        console.error("Employee transaction record not found for _id:", id);
      }
    });
  } catch (error) {
    console.error("Error deleting data in EmployeeTransactionModel:", error);
  } finally {
    if (realm) {
      realm.close();
    }
  }
}

async function getEmployeeTransactionByQuery(queryObj) {
  let realm;
  try {
    realm = await getRealm(EmployeeTransactionModel);

    let query = realm.objects("EmployeeTransactionModel");

    if (queryObj._id) {
      const uuid = new UUID(queryObj._id);
      query = query.filtered(`_id == $0`, uuid);
    }
    if (queryObj.employee_id) {
      query = query.filtered(`employee_id == '${queryObj.employee_id}'`);
    }
    if (queryObj.date_created) {
      query = query.filtered(`date_created == '${queryObj.date_created}'`);
    }

    const employeeTransactionRecords = query.toJSON();

    //console.log(employeeTransactionRecords);
    return employeeTransactionRecords;
  } catch (error) {
    console.error(
      "Error retrieving data from EmployeeTransactionModel:",
      error
    );
    throw error;
  } finally {
    if (realm) {
      realm.close();
    }
  }
}

async function getEmployeeTransactionByDate(startDate, endDate) {
  let realm;
  try {
    realm = await getRealm(EmployeeTransactionModel);

    let startDateDouble = startDate ? new Date(startDate).getTime() : null;
    let endDateDouble = endDate ? new Date(endDate).getTime() : null;

    let query = realm.objects("EmployeeTransactionModel");

    if (startDateDouble && endDateDouble) {
      query = query.filtered(
        "date_created >= $0 AND date_created <= $1",
        startDateDouble,
        endDateDouble
      );
    } else if (startDateDouble) {
      query = query.filtered("date_created >= $0", startDateDouble);
    } else if (endDateDouble) {
      query = query.filtered("date_created <= $0", endDateDouble);
    }

    const employeeTransactionRecords = query.toJSON();

    // console.log(employeeAttendanceRecords);
    return employeeTransactionRecords;
  } catch (error) {
    console.error(
      "Error retrieving data from EmployeeTransactionModel:",
      error
    );
    throw error;
  } finally {
    if (realm) {
      realm.close();
    }
  }
}

module.exports = {
  addEmployeeTransaction,
  getEmployeeTransaction,
  updateEmployeeTransaction,
  deleteEmployeeTransactionById,
  getEmployeeTransactionByQuery,
  getEmployeeTransactionByDate,
};
