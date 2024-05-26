// const handleCookies = {
//   setCookie(key: string, value: string, expiredays: number): void {
//     let todayDate = new Date();
//     todayDate.setDate(todayDate.getDate() + expiredays); // 현재 시각 + 일 단위로 쿠키 만료 날짜 변경
//     //todayDate.setTime(todayDate.getTime() + (expiredays * 24 * 60 * 60 * 1000)); // 밀리세컨드 단위로 쿠키 만료 날짜 변경
//     document.cookie =
//       key +
//       "=" +
//       // escape(value) + //'escape' is deprecated. encodeURI로 대체합니다.
//       encodeURI(value) +
//       "; path=/; expires=" +
//       // todayDate.toGMTString() + // toGMTString()도 더 이상 사용되지 않습니다. UTC로 변경합니다.
//       todayDate.toUTCString() +
//       ";";
//   },
//   delCookie(key: string): void {
//     let todayDate = new Date();
//     document.cookie =
//       key + "=; path=/; expires=" + todayDate.toUTCString() + ";"; // 현재 시각 이전이면 쿠키가 만료되어 사라짐.
//   },
// };

// export default handleCookies;
// export const { setCookie, delCookie } = handleCookies;
