const Realm = require("realm");
const getRealm = require("../getRealm");
const EmployeeAttendanceModel = require("../model/EmployeeAttendanceModel");
const UUID = Realm.BSON.UUID;

function dateToDouble(date) {
  return date.getTime();
}

///add new object
async function addEmployeeAttendance(data) {
  let realm;
  let createdAttendance = null;
  try {
    realm = await getRealm(EmployeeAttendanceModel);

    realm.write(() => {
      createdAttendance = realm.create("EmployeeAttendanceModel", {
        _id: new UUID(),
        store_id: data.store_id,
        employee_id: data.employee_id,
        date_created: dateToDouble(new Date()),
        date_updated: null,
        value: data.value,
        remarks: data.remarks,
      });
    });
    return createdAttendance.toJSON();
    //console.log("Data added successfully to EmployeeAttendanceModel");
  } catch (error) {
    console.error("Error adding data to EmployeeAttendanceModel:", error);
  } finally {
    if (realm) {
      realm.close();
    }
  }
}

//get all objects
async function getEmployeeAttendance() {
  let realm;
  try {
    realm = await getRealm(EmployeeAttendanceModel);
    const employeeAttendanceRecords = realm
      .objects("EmployeeAttendanceModel")
      .toJSON();

    //console.log(employeeAttendanceRecords);
    return employeeAttendanceRecords;
  } catch (error) {
    console.error("Error retrieving data from EmployeeAttendanceModel:", error);
    throw error;
  } finally {
    if (realm) {
      realm.close();
    }
  }
}

//update one object by id
async function updateEmployeeAttendance(data) {
  let realm;
  try {
    realm = await getRealm(EmployeeAttendanceModel);
    let updatedData = null;

    realm.write(() => {
      let existingData = realm.objectForPrimaryKey(
        "EmployeeAttendanceModel",
        data._id
      );

      if (existingData) {
        // Update the existing data with the provided values
        existingData.value = data.value;
        existingData.remarks = data.remarks;
        existingData.date_updated = dateToDouble(new Date());
        updatedData = existingData;
      } else {
        console.error(
          "Employee attendance record not found for _id:",
          data._id
        );
      }
    });

    return updatedData.toJSON();
    //console.log("Data updated successfully in EmployeeAttendanceModel");
  } catch (error) {
    console.error("Error updating data in EmployeeAttendanceModel:", error);
  } finally {
    if (realm) {
      realm.close();
    }
  }
}

//delete object by id
async function deleteEmployeeAttendanceById(id) {
  let realm;
  try {
    realm = await getRealm(EmployeeAttendanceModel);

    realm.write(() => {
      const existingData = realm.objectForPrimaryKey(
        "EmployeeAttendanceModel",
        id
      );

      if (existingData) {
        realm.delete(existingData);
        console.log(`Employee attendance record with _id ${id} deleted.`);
      } else {
        console.error("Employee attendance record not found for _id:", id);
      }
    });
  } catch (error) {
    console.error("Error deleting data in EmployeeAttendanceModel:", error);
  } finally {
    if (realm) {
      realm.close();
    }
  }
}

//get object by id,employee_id and date_created

async function getEmployeeAttendanceByQuery(queryObj) {
  let realm;
  try {
    realm = await getRealm(EmployeeAttendanceModel);

    let query = realm.objects("EmployeeAttendanceModel");

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

    const employeeAttendanceRecords = query.toJSON();

    //console.log(employeeAttendanceRecords);
    return employeeAttendanceRecords;
  } catch (error) {
    console.error("Error retrieving data from EmployeeAttendanceModel:", error);
    throw error;
  } finally {
    if (realm) {
      realm.close();
    }
  }
}

//filter the object by date
async function getEmployeeAttendanceByDate(startDate, endDate) {
  let realm;
  try {
    realm = await getRealm(EmployeeAttendanceModel);

    let startDateDouble = startDate ? new Date(startDate).getTime() : null;
    let endDateDouble = endDate ? new Date(endDate).getTime() : null;

    let query = realm.objects("EmployeeAttendanceModel");

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

    const employeeAttendanceRecords = query.toJSON();

    // console.log(employeeAttendanceRecords);
    return employeeAttendanceRecords;
  } catch (error) {
    console.error("Error retrieving data from EmployeeAttendanceModel:", error);
    throw error;
  } finally {
    if (realm) {
      realm.close();
    }
  }
}

module.exports = {
  addEmployeeAttendance,
  getEmployeeAttendance,
  updateEmployeeAttendance,
  deleteEmployeeAttendanceById,
  getEmployeeAttendanceByDate,
  getEmployeeAttendanceByQuery,
};
