console.log('fullstack academy')

// string
const name = 'Tulio Faria'

// object (json)
const person = {
  firstName: 'Tulio',
  lastName: 'Faria'
}
person.firstName = 'Faria'

// integer
let count = 0
count++
console.log(count)

let vetor = [1,2,3]
vetor.push(1)

console.log(vetor)

// ==
// ===

if(count === 1){
  console.log('count eh igual a 1')
}else{

}
while(count < 2){
  count++
}
for(let i=1; i < 10; i++){
  console.log(i)
}

console.log('============================')
// functional
const latir = function(){
  console.log('auuuuuu!')
}
const miau = function(){
  console.log('miauuu!')
}

// high order function
const gerarSom = function(qtd, tipo){
  for(let i=0; i< qtd; i++){
    tipo()
  }
}
gerarSom(3, miau)
gerarSom(2, latir)

// 
const itens = [1,2,3,4]

// pure function
const dobro = valor => valor*2
const dobro2 = (valor) => {
  // ....
  return valor*2
}

console.log('0' == 0)
console.log('0' === 0)

console.log(dobro(1)) // 2
console.log(dobro(2)) // 4

const itens2 = itens.map(dobro)
console.log(itens2)

const somentePares = value => value%2===0
const pares = itens.filter(somentePares)
console.log('pares', pares)

// legibilidade
const soma = (anterior, atual) => anterior+atual
const total = itens.reduce(soma, 0)
console.log('soma', total)

// map 'mapeando'
const pessoas = [
  {
    nome: 'Tulio',
    idade: 31
  },
  {
    nome: 'Faria',
    idade: 31
  }
]
console.log(pessoas.map( pessoa => pessoa.nome ))

if( ('a'==='b') && (1==1) ){

}else if(true){

}else{
  
}
