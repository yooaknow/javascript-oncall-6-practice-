import { Console } from "@woowacourse/mission-utils";

const OutputView = {
  printPreview(Month, day, week, name) {
    Console.print(`${Month} ${day}일 ${week} ${name} `);
  },

  printError(message) {
    Console.print(message);
  }
};

export default OutputView;
