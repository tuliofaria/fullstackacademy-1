const fs = require('fs')
const path = './'

function readdirPromise(arquivo){
  return new Promise((resolve, reject) => {
    fs.readdir(arquivo, (err, content) =>{
      if(err){
        reject(err)
      }else{
        resolve(content)
      }
    })
  })
}

function stat(file){
  return new Promise((resolve, reject) => {
    fs.stat(file, (err, stat) => {
      if(err){
        reject(err)
      }else{
        resolve({
          file,
          stat
        })
      }
    })
  })
}

async function listaArquivos(arquivo){
  try{
    const all = await readdirPromise(arquivo)
    
    const promises = all.map(async (file) => await stat(file))
    const retorno = await Promise.all(promises)
    const files = retorno.filter((file) => file.stat.isFile())
    files.map((file) => console.log(file.file))

    
  }catch(e){
    console.log(e)
  }
}

listaArquivos(path)
console.log('opa')