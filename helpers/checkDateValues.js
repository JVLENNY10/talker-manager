const checkDateValues = (dateValues) => (
  dateValues.every((date, index) => {
    if (index < 2 && date.length === 2) {
      return true;
    } if (date.length === 4) {
      return true;
    }

    return false;
  })
);

module.exports = checkDateValues;
