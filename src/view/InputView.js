/* 
비상 근무를 배정할 월과 시작 요일을 입력하세요> 1,금
평일 비상 근무 순번대로 사원 닉네임을 입력하세요> 준팍,도밥,고니,수아,루루,글로
휴일 비상 근무 순번대로 사원 닉네임을 입력하세요> 수아,수아,글로,고니,도밥,준팍
[ERROR] 유효하지 않은 입력 값입니다. 다시 입력해 주세요.
평일 비상 근무 순번대로 사원 닉네임을 입력하세요>
*/ 

import { Console } from "@woowacourse/mission-utils";

const InputView = {
  async readDate() {
    const input = await Console.readLineAsync(
      "비상 근무를 배정할 월과 시작 요일을 입력하세요>"
    );
    return input;
  },

  async readweekday() {
    const input = await Console.readLineAsync(
      "평일 비상 근무 순번대로 사원 닉네임을 입력하세요>"
    );
    return input;
  },
  
    async readweekend() {
    const input = await Console.readLineAsync(
      "휴일 비상 근무 순번대로 사원 닉네임을 입력하세요>"
    );
    return input;
  },


};

export default InputView;
