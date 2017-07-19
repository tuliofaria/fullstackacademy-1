const fs = require('fs')

// callback
/*fs.readFile('exemplo1.js', (err, content) =>{
  console.log(err, content)
})*/

function lerArquivo(arquivo){
  return new Promise((resolve, reject) => {
    fs.readFile(arquivo, (err, content) =>{
      if(err){
        reject(err)
      }else{
        resolve(content)
      }
    })
  })
}
/*
lerArquivo('exemplo1.js')
  .then((content) => console.log(content))*/

async function pegarConteudo(arquivo){
  try{
    const content = await lerArquivo(arquivo)
    console.log('content', content)

    const content2 = await lerArquivo('assincronismo.js')
    console.log('content2', content2)
  }catch(e){
    console.log(e)
  }
}
pegarConteudo('exemplo1.js')
console.log('=====================opa')
