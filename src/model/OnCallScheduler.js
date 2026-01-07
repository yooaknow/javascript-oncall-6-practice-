import {
  DAYS_IN_MONTH,
  WEEKDAYS,
  isWeekend,
  isLegalHoliday,
} from '../constants/Calendar.js';

class OnCallScheduler {
  #month;
  #startDayIndex;
  #weekdayOrder;
  #holidayOrder;

  constructor(month, startDayIndex, weekdayOrder, holidayOrder) {
    this.#month = month;
    this.#startDayIndex = startDayIndex;
    this.#weekdayOrder = [...weekdayOrder];
    this.#holidayOrder = [...holidayOrder];
  } // 외부 배열을 그대로 쓰면, 밖에서 배열 수정 -> 스케줄러 내부까지 깨짐

  generate() {
    const results = []; // 출력할 문자열
    const total = DAYS_IN_MONTH[this.#month]; //이번달은 총 며칠인지

    let weekdayIdx = this.#startDayIndex; //요일 계산용 인덱스
    let weekdayOrderIdx = 0; // 평일 담당자 순서 포인터
    let holidayOrderIdx = 0; // 휴일 담장자 순서 포인터
    let prev = null; // 바로 전 날 당직자 (연속 방지)

    for (let day = 1; day <= total; day += 1) {
      const weekday = WEEKDAYS[weekdayIdx % 7];
      // 0~6 반복 -> 시작 요일이 어디든 자연스럽게 돌아감

      const legalHoliday = isLegalHoliday(this.#month, day);
      // Calendar.js에서 가져옴. 이번 달, 이 날짜가 공휴일이야?
      const weekend = isWeekend(weekday);
      // 오늘이 토요일/ 일요일이야?
      const isHoliday = weekend || legalHoliday;
      // 주말이거나 공휴일이야?

      let display;

      if (!weekend && legalHoliday) {
        display = `${weekday}(휴일)`;
      } else {
        display = weekday;
      }


      let pick;

      if (isHoliday) {
        pick = this.#pick(this.#holidayOrder, holidayOrderIdx, prev);
      } else {
        pick = this.#pick(this.#weekdayOrder, weekdayOrderIdx, prev);
      }

      // 오늘 휴일이면 휴일 명단에서 사람을 뽑고, 휴일이 아니면 평일 명단에서 사람을 뽑는다.
      // 사용할 순번 배열 (휴일/ 평일), index - 지금 몇번째 차례인지, prev 어제 담당자

      const { worker, nextIndex } = pick;
      // { worker: "허브", nextIndex: 4 } pick이 반환하는 형태

      if (isHoliday) holidayOrderIdx = nextIndex;
      else weekdayOrderIdx = nextIndex;
      // 오늘 평일이면 -> 평일 인덱스 증가 
      // 오늘 휴일이면 -> 휴일 인덱스 증가

      results.push(`${this.#month}월 ${day}일 ${display} ${worker}`);

      prev = worker; // 오늘 담당자 기억
      weekdayIdx += 1; // 요일 하루 증가 
    }

    return results;
  }

  #pick(order, index, prev) {
    const len = order.length;
    const cur = index % len; // 끝으로 가면 다시 처음으로 돌아오도록
    const next = (index + 1) % len; // 그 다음 순서를 보여줌

    // order - 후보 리스트 (평일 or 휴일), index - 지금 차례, prev- 어제 담당자 

    if (order[cur] === prev) {
      const t = order[cur]; 
      order[cur] = order[next];
      order[next] = t;
    }
    // 다음 순서랑 바꾸기

    return { worker: order[cur], nextIndex: index + 1 };
  }
}

export default OnCallScheduler;
