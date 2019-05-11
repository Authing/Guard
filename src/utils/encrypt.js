export function encryptMethod(str, key) {
  while (str.length > key.length) {
    key += key;
  }
  var r = key.substr(0, str.length);

  var i = 0;
  var arr = [];
  for (i = 0; i < str.length; i++) {
    arr.push(str.charCodeAt(i) ^ r.charCodeAt(i));
  }
  var uglyStr = "";
  arr.map(function(char) {
    uglyStr += String.fromCharCode(char);
  });
  return uglyStr;
}
export function encrypt(str, key) {
  var out = window.btoa(this.encryptMethod(str, key));
  return out;
}
export function decrypt(str, key) {
  str = window.atob(str);
  return this.encryptMethod(str, key);
}