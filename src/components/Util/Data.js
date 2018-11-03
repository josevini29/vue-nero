export function getDateNowJSON () {
  var data = new Date()
  let dia = data.getDate().toString()
  let diaF = (dia.length === 1) ? '0' + dia : dia
  let mes = (data.getMonth() + 1).toString()
  let mesF = (mes.length === 1) ? '0' + mes : mes
  let anoF = data.getFullYear()
  return anoF + '-' + mesF + '-' + diaF
}

export function formatarDataFirestore (data) {
  let dia = data.toDate().getDate().toString()
  let diaF = (dia.length === 1) ? '0' + dia : dia
  let mes = (data.toDate().getMonth() + 1).toString()
  let mesF = (mes.length === 1) ? '0' + mes : mes
  let anoF = data.toDate().getFullYear()
  return diaF + '/' + mesF + '/' + anoF
}

export function formatarDataHoraFirestore (data) {
  let dia = data.toDate().getDate().toString()
  let diaF = (dia.length === 1) ? '0' + dia : dia
  let mes = (data.toDate().getMonth() + 1).toString()
  let mesF = (mes.length === 1) ? '0' + mes : mes
  let anoF = data.toDate().getFullYear()
  let hora = data.toDate().getHours().toString()
  let horaF = (hora.length === 1) ? '0' + hora : hora
  let minute = data.toDate().getMinutes().toString()
  let minuteF = (minute.length === 1) ? '0' + minute : minute
  let second = data.toDate().getSeconds().toString()
  let secondF = (second.length === 1) ? '0' + second : second
  return diaF + '/' + mesF + '/' + anoF + ' ' + horaF + ':' + minuteF + ':' + secondF
}
