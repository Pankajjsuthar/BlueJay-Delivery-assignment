const xlsx = require("xlsx");
const fs = require("fs");

// Load the Excel file
const workbook = xlsx.readFile("Assignment_Timecard.xlsx");

// Assuming the data is in the first sheet of the workbook
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert the worksheet to an array of objects
const fdata = xlsx.utils.sheet_to_json(worksheet, {
  raw: false,
});

// Save the current console.log function
const originalConsoleLog = console.log;

// Create a write stream to a file (output.txt)
const outputStream = fs.createWriteStream("output.txt");

// Redirect console.log to write to the file
console.log = function (message) {
  originalConsoleLog(message); // Print to the console as well
  outputStream.write(`${message}\n`);
};

const employeeMap = new Map();

const data = [];
const removeData = [];

function addToMap(employeeKey, record) {
  if (!employeeMap.has(employeeKey)) {
    employeeMap.set(employeeKey, []);
  }
  employeeMap.get(employeeKey).push({
    "Time In": record["Time"],
    "Time Out": record["Time Out"],
    "Timecard Hours": record["Timecard Hours (as Time)"],
  });
}

fdata.map((record) => {
  if (
    record["Time Out"] !== "" &&
    record["Timecard Hours (as Time)"] !== "" &&
    record["Pay Cycle Start Date"] !== "" &&
    record["Pay Cycle End Date"] !== "" &&
    record["Time"] !== ""
  ) {
    record["Time"] = new Date(record["Time"]);
    record["Time Out"] = new Date(record["Time Out"]);
    const employeeKey = record["Employee Name"] + ", " + record["Position ID"];
    addToMap(employeeKey, record);
  } else {
    removeData.push(record);
  }
});

// console.log(employeeMap);
const employeesWithConsecutive7Days = [];
const employeesWithLessThan10HoursBetweenShifts = [];
const employeesWithMoreThan14HoursInSingleShift = [];
const employeesWithMoreThan14HoursInSingleDay = [];

function calculateTimeDifference(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const differenceInMilliseconds = start - end;
  return differenceInMilliseconds / (60 * 60 * 1000); // Convert to hours
}

function findEmployeesWithLessThan10HoursBetweenShifts(employeeMap) {
  employeeMap.forEach((logs, name) => {
    var n = logs.length;
    var endTime = logs[0]["Time Out"];
    for (var i = 1; i < n; i++) {
      var startTime = logs[i]["Time In"];
      const timeDifference = calculateTimeDifference(startTime, endTime);
      if (timeDifference > 1 && timeDifference < 10) {
        if (employeesWithLessThan10HoursBetweenShifts.length === 0) {
          employeesWithLessThan10HoursBetweenShifts.push(name);
        } else if (
          employeesWithLessThan10HoursBetweenShifts[
            employeesWithLessThan10HoursBetweenShifts.length - 1
          ] !== name
        ) {
          employeesWithLessThan10HoursBetweenShifts.push(name);
        }
      }
      endTime = logs[i]["Time Out"];
    }
  });
}

findEmployeesWithLessThan10HoursBetweenShifts(employeeMap);

function findEmployeesWithConsecutive7Days(employeeMap) {
  var startDate = null;
  employeeMap.forEach((logs, name) => {
    var n = logs.length;
    var daysCount = 1;
    var shiftHours = 0;
    for (var i = 0; i < n; i++) {
      const timeCard = parseInt(logs[i]["Timecard Hours"]);
      // console.log((logs[i]["Timecard Hours"]));
      if (timeCard > 14) {
        employeesWithMoreThan14HoursInSingleShift.push(name);
      }
      if (startDate === null) {
        startDate = logs[i]["Time In"].setHours(0, 0, 0, 0);
        shiftHours += timeCard;
      } else {
        const timeDifference =
          logs[i]["Time In"].setHours(0, 0, 0, 0) - startDate;
        var diffDays = Math.abs(
          Math.ceil(timeDifference / (1000 * 3600 * 24))
        ); //gives day difference

        startDate = logs[i]["Time In"].setHours(0, 0, 0, 0);

        if (diffDays === 0) {
          shiftHours += timeCard;
          continue;
        } else if (diffDays === 1) {
          shiftHours = timeCard;
          daysCount++;
        } else {
          shiftHours = timeCard;
          daysCount = 1;
        }

        if (shiftHours > 14) {
          if (employeesWithMoreThan14HoursInSingleDay.length === 0) {
            employeesWithMoreThan14HoursInSingleDay.push(name);
          } else if (
            employeesWithMoreThan14HoursInSingleDay[
              employeesWithMoreThan14HoursInSingleDay.length - 1
            ] !== name
          ) {
            employeesWithMoreThan14HoursInSingleDay.push(name);
          }
        }

        if (daysCount >= 7) {
          if (employeesWithConsecutive7Days.length === 0) {
            employeesWithConsecutive7Days.push(name);
          } else if (
            employeesWithConsecutive7Days[
              employeesWithConsecutive7Days.length - 1
            ] !== name
          ) {
            employeesWithConsecutive7Days.push(name);
          }
        }
      }
    }
  });
}

findEmployeesWithConsecutive7Days(employeeMap);

console.log("The employees who worked for 7 consecutive days :" + "\n");
employeesWithConsecutive7Days.map((value) => {
  console.log(value + "\n");
});

console.log(
  "The employees who have less than 10 hours of time between shifts but greater than 1 hour :" +
    "\n"
);
employeesWithLessThan10HoursBetweenShifts.map((value) => {
  console.log(value + "\n");
});

console.log(
  "The employees who have worked for more than 14 hours in a single shift : " +
    "\n"
);
employeesWithMoreThan14HoursInSingleShift.map((value) => {
  console.log(value + "\n");
});
console.log(
  "The employees who have worked for more than 14 hours in a single day :" + "\n"
);
employeesWithMoreThan14HoursInSingleDay.map((value) => {
  console.log(value + "\n");
});

outputStream.end();
