const earliestSupportedWeek = 1;
const lastWeekOfSem1 = 23;
const lastWeekOfSem2 = 40;
const lastWeekOfSpecialSem1 = 46;
const lastWeekOfSpecialSem2 = 52;

const currAcadWkInfo = getAcadWeekInfo(new Date());
document.getElementById("curr_wk").innerHTML = `AY22/23 ${currAcadWkInfo.sem}, Week ${currAcadWkInfo.num} [${currAcadWkInfo.type}]`;

if(currAcadWkInfo.sem === "Semester 1") {
  console.log((currAcadWkInfo.num / lastWeekOfSem1));
  var elem = document.getElementById("progress_bar");
  elem.style.width = (currAcadWkInfo.num / 13) * 100 + "%";
  document.getElementById("progress_percentage").innerHTML = Math.ceil((currAcadWkInfo.num / 13) * 100) + "%";
}

const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: true
};

function setTime() {
  document.getElementById("date").innerHTML = new Date().toLocaleString('en-GB', options);
}

setInterval(setTime, 1000);

const WeekType = {
  Instructional: 'Instructional',
  Reading: 'Reading',
  Examination: 'Examination',
  Recess: 'Recess',
  Vacation: 'Vacation',
  Orientation: 'Orientation'
};

function getAcadWeekName(acadWeekNumber) {
  switch (acadWeekNumber) {
    case 7:
      return {
        weekType: 'Recess',
        weekNumber: null,
      };
    case 15:
      return {
        weekType: 'Reading',
        weekNumber: null,
      };
    case 16:
    case 17:
      return {
        weekType: 'Examination',
        weekNumber: acadWeekNumber - 15,
      };
    default: {
      let weekNumber = acadWeekNumber;
      if (weekNumber >= 8) {
        // For weeks after recess week
        weekNumber -= 1;
      }

      if (acadWeekNumber < 1 || acadWeekNumber > 17) {
        console.warn(`[nusmoderator] Unsupported acadWeekNumber as parameter: ${acadWeekNumber}`);
        return null;
      }

      return {
        weekType: 'Instructional',
        weekNumber,
      };
    }
  }
}

function getAcadSem(acadWeekNumber) {
  if (acadWeekNumber < earliestSupportedWeek) {
    console.warn(`Unsupported acadWeekNumber: ${acadWeekNumber}`);
    return null;
  }

  if (acadWeekNumber <= lastWeekOfSem1) return "Semester 1";
  if (acadWeekNumber <= lastWeekOfSem2) return "Semester 2";
  if (acadWeekNumber <= lastWeekOfSpecialSem1) return "special1";
  if (acadWeekNumber <= lastWeekOfSpecialSem2) return "special2";

  console.warn(`Unsupported acadWeekNumber: ${acadWeekNumber}`);
  return null;
}


function getAcadWeekInfo(date) {
  const acadYearStartDate = new Date(2022, 7, 1);

  let acadWeekNumber = Math.ceil(
    (date.getTime() - acadYearStartDate.getTime() + 1) / (1000*7*24*60*60),
  );
  
  const semester = getAcadSem(acadWeekNumber);

  let weekType = null;
  let weekNumber = null;
  switch (semester) {
    case "Semester 2":
      acadWeekNumber -= 22;
    case "Semester 1":
      if (acadWeekNumber === 1) {
        weekType = 'Orientation';
        break;
      }
      if (acadWeekNumber > 18) {
        weekType = 'Vacation';
        weekNumber = acadWeekNumber - 18;
        break;
      }
      acadWeekNumber -= 1;
      const acadWeek = getAcadWeekName(acadWeekNumber);
      weekType = acadWeek.weekType;
      weekNumber = acadWeek.weekNumber;
      break;
    case "special2":
      acadWeekNumber -= 6;
    case "special1":
      acadWeekNumber -= 40;
      weekType = 'Instructional';
      weekNumber = acadWeekNumber;
      break;
    default:
      if (acadWeekNumber === 53) {
        weekType = 'Vacation';
        weekNumber = null;
      }
      break;
  }

  return {
    year: new Date().getYear() + 1900,
    sem: semester,
    type: weekType,
    num: weekNumber,
  };
};