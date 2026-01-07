import InputView from '../view/InputView.js';
import OutputView from '../view/OutputView.js';
import {
  parseMonthAndStartDay,
  parseOrders,
  error,
} from '../utils/validators.js';
import OnCallScheduler from '../model/OnCallScheduler.js';

class OnCallController {
  async run() {
    const { month, startDayIndex } = await this.#readMonthAndDay();
    const { weekdayOrder, holidayOrder } = await this.#readOrders();

    const scheduler = new OnCallScheduler(
      month,
      startDayIndex,
      weekdayOrder,
      holidayOrder,
    );

    scheduler.generate().forEach(OutputView.print);
    // scheduler.generate() -> 출력할 문자열 배열 생성
    // forEach(...) -> 배열을 순회
    // OutputView.print -> 각 문자열을 화면에 출력
  }

  async #readMonthAndDay() {
    while (true) {
      try {
        const input = await InputView.readMonthAndStartDay();
        return parseMonthAndStartDay(input);
      } catch {
        OutputView.print(error().message);
      }
    }
  }

  async #readOrders() {
    while (true) {
      try {
        const weekdayRaw = await InputView.readWeekdayOrder();
        const holidayRaw = await InputView.readHolidayOrder();
        return parseOrders(weekdayRaw, holidayRaw);
      } catch {
        OutputView.print(error().message);
      }
    }
  }
}

export default OnCallController;
