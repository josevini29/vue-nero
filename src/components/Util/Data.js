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
  let dia = data.getDate().toString()
  let diaF = (dia.length === 1) ? '0' + dia : dia
  let mes = (data.getMonth() + 1).toString()
  let mesF = (mes.length === 1) ? '0' + mes : mes
  let anoF = data.getFullYear()
  return diaF + '/' + mesF + '/' + anoF
}

export function formatarDataHoraFirestore (data) {
  let dia = data.getDate().toString()
  let diaF = (dia.length === 1) ? '0' + dia : dia
  let mes = (data.getMonth() + 1).toString()
  let mesF = (mes.length === 1) ? '0' + mes : mes
  let anoF = data.getFullYear()
  let hora = data.getHours().toString()
  let horaF = (hora.length === 1) ? '0' + hora : hora
  let minute = data.getMinutes().toString()
  let minuteF = (minute.length === 1) ? '0' + minute : minute
  let second = data.getSeconds().toString()
  let secondF = (second.length === 1) ? '0' + second : second
  return diaF + '/' + mesF + '/' + anoF + ' ' + horaF + ':' + minuteF + ':' + secondF
}

export function obterMeses () {
  let meses = []
  meses.push({cdMes: '01', dsMes: 'Janeiro'})
  meses.push({cdMes: '02', dsMes: 'Fevereiro'})
  meses.push({cdMes: '03', dsMes: 'Março'})
  meses.push({cdMes: '04', dsMes: 'Abril'})
  meses.push({cdMes: '05', dsMes: 'Maio'})
  meses.push({cdMes: '06', dsMes: 'Junho'})
  meses.push({cdMes: '07', dsMes: 'Julho'})
  meses.push({cdMes: '08', dsMes: 'Agosto'})
  meses.push({cdMes: '09', dsMes: 'Setembro'})
  meses.push({cdMes: '10', dsMes: 'Outubro'})
  meses.push({cdMes: '11', dsMes: 'Novembro'})
  meses.push({cdMes: '12', dsMes: 'Dezembro'})
  return meses
}

export function obterUltimoDiaMes (data) {
  data.setDate(1)
  data.setMonth(data.getMonth() + 1)
  data.setDate(data.getDate() - 1)
  return data
}
