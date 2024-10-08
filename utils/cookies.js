// export default function cookie(name) {
//   // var nameEQ = name + "=";
//   // var ca = document.cookie.split(";");
//   // for (var i = 0; i < ca.length; i++) {
//   //   var c = ca[i];
//   //   while (c.charAt(0) == " ") c = c.substring(1, c.length);
//   //   if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
//   // }
//   // return null;
//   let item = localStorage.getItem(name.split("=")[0]);
//   if (item) return item;
//   return null;
// }
// export function setCookie(name, value, days) {

//   // var expires = "";
//   // if (days) {
//   // var date = new Date();
//   // date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
//   // expires = "; expires=" + date.toUTCString();
//   // }
//   // TODO uncomment first line
//   // document.cookie = name + "=" + (value || "") + expires + "; path=/;domain=.signtunes.com";
//   // document.cookie = name + "=" + (value || "") + expires;
//   localStorage.setItem(name, value ?? "");
// }

export default function cookie(name) {
  if (typeof window !== 'undefined') { // Check if window is defined
      let item = localStorage.getItem(name.split("=")[0]);
      if (item) return item;
  }
  return null;
}

export function setCookie(name, value, days) {
  if (typeof window !== 'undefined') { // Check if window is defined
      localStorage.setItem(name, value ?? "");
  }
}
