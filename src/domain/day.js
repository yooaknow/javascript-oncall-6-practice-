
class Day {
  constructor(dayString) {
    const day = parseInt(dayString, 10);

    if (isNaN(day) || day < 1 || day > 31) {
      throw new Error("[ERROR] 유효하지 않은 입력 값입니다. 다시 입력해 주세요.");
    }

    this.day = day;
  }
}
export default Day;
