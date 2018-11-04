export function getArrayCores (qtde) {
  let cores = []
  for (let i = 0; i < qtde; i++) {
    cores.push(geraCorAleatorio())
  }
  return cores
}

export function geraCorAleatorio () {
  var hexadecimais = '0123456789ABCDEF'
  var cor = '#'
  for (var i = 0; i < 6; i++) {
    cor += hexadecimais[Math.floor(Math.random() * 16)]
  }
  return cor
}
