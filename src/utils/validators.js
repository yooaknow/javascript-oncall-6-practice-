// 달 정보(각 달의 일수)와 요일 목록 상수
import { DAYS_IN_MONTH, WEEKDAYS } from '../constants/Calendar.js';

// 모든 입력 에러에서 공통으로 사용할 메시지
const ERROR =
  '[ERROR] 유효하지 않은 입력 값입니다. 다시 입력해 주세요.';

// 동일한 에러 객체를 만들어 반환하는 함수
// (컨트롤러에서 message만 사용)
export const error = () => new Error(ERROR);

/**
 * "월,시작요일" 입력을 파싱하고 검증한다.
 *
 * 예: "4,토"
 *  -> { month: 4, startDayIndex: 6 } 이런 형식으로 변환
 */
export const parseMonthAndStartDay = (input) => {
  // 입력이 비었으면 에러
  if (!input) throw error();

  // 쉼표 기준으로 분리 (반드시 2개여야 함)
  const parts = input.split(',');
  if (parts.length !== 2) throw error();

  // 앞부분: 월, 뒷부분: 요일
  const month = Number(parts[0].trim());
  const day = parts[1].trim();

  // 존재하지 않는 달이면 에러
  // (예: 0, 13, 문자 등)
  if (!DAYS_IN_MONTH[month]) throw error();

  // 요일이 WEEKDAYS에 존재하는지 확인
  const startDayIndex = WEEKDAYS.indexOf(day);
  if (startDayIndex === -1) throw error();

  // 컨트롤러 → 모델로 넘길 포맷
  return { month, startDayIndex };
};

/**
 * 이름 목록(쉼표 구분 문자열)을 배열로 변환하고 검증한다.
 *
 * 예: "허브, 쥬니, 말랑"
 *  -> ["허브", "쥬니", "말랑"]
 */
const parseList = (raw) => {
  // 입력 자체가 없으면 에러
  if (!raw) throw error();

  // 1) 쉼표로 자르고
  // 2) 앞뒤 공백 제거하고
  // 3) 빈 값은 제거한다
  const list = raw
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

  // 결과가 비면 에러
  if (list.length === 0) throw error();

  // 중복 이름이 있으면 에러
  // Set은 중복을 자동 제거하기 때문에
  // 사이즈가 달라지면 → 중복이 있었다는 의미
  const uniq = new Set(list);
  if (uniq.size !== list.length) throw error();

  return list;
};

/**
 * 평일 순번 + 휴일 순번을 파싱하고 검증한다.
 *
 * 규칙:
 *  - 두 목록 모두 유효해야 하고
 *  - 길이가 같아야 하고
 *  - 구성원이 완전히 동일해야 한다 (순서만 다를 수 있음)
 */
export const parseOrders = (weekdayRaw, holidayRaw) => {
  // 각각 먼저 리스트로 처리 + 기본 검증
  const weekdayOrder = parseList(weekdayRaw);
  const holidayOrder = parseList(holidayRaw);

  // 전체 인원 수가 다르면 에러
  if (weekdayOrder.length !== holidayOrder.length) throw error();

  // 고유 멤버 집합(Set)으로 변환
  const ws = new Set(weekdayOrder);
  const hs = new Set(holidayOrder);

  // 고유 멤버 수가 다르면 에러
  if (ws.size !== hs.size) throw error();

  // 평일에 있는 모든 사람이 휴일에도 있는지 확인
  ws.forEach((n) => {
    if (!hs.has(n)) throw error();
  });

  // 검증 완료 → 사용 가능한 구조로 반환
  return { weekdayOrder, holidayOrder };
};
