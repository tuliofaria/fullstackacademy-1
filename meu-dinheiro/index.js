const express = require('express')
const app = express()
const port = 3001

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

const MongoClient = require('mongodb').MongoClient
const mongoUri =                                                                                                                                                  'mongodb://devpleno:nvwWsLzwD8foo5td@meu-dinheiro-shard-00-00-quzca.mongodb.net:27017,meu-dinheiro-shard-00-01-quzca.mongodb.net:27017,meu-dinheiro-shard-00-02-quzca.mongodb.net:27017/meu-dinheiro-live?ssl=true&replicaSet=meu-dinheiro-shard-0&authSource=admin'

app.use(express.static('public'))

const path = require('path')

// onde estão os templates
app.set('views', path.join(__dirname, 'views'))
// tipo de template
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('home')
})

const calculoJuros = (p, i, n) => p*Math.pow(1+i, n)
const evolucao = (p, i, n) => Array
                                .from(new Array(n), (n,i) => i + 1)
                                .map(mes => { 
                                              return {
                                                mes, 
                                                juros: calculoJuros(p, i, mes)
                                              }
                                            })

app.get('/calculadora', (req, res) => {
  const resultado = {
    calculado: false
  }
  if(req.query.valorInicial && req.query.taxa && req.query.tempo){
    resultado.calculado = true
    resultado.total = calculoJuros(
      parseFloat(req.query.valorInicial),
      parseFloat(req.query.taxa)/100, 
      parseInt(req.query.tempo)
    )
    resultado.evolucao = evolucao(
      parseFloat(req.query.valorInicial),
      parseFloat(req.query.taxa)/100, 
      parseInt(req.query.tempo)
    )
  }
  res.render('calculadora', { resultado })
})

const find = (db, collectionName, conditions) => {
  const collection = db.collection(collectionName)
  const cursor = collection.find(conditions)
  const documents = []

  return new Promise((resolve, reject) => {
    cursor.forEach(
      (doc) => documents.push(doc),
      () => resolve(documents)
    )
  })
}

const insert = (db, collectionName, document) => {
  const collection = db.collection(collectionName)
  return new Promise((resolve, reject) =>{
    collection.insert(document, (err, doc) => {
      if(err){
        reject(err)
      }else{
        resolve(doc)
      }
    })
  })
}

const ObjectID = require('mongodb').ObjectID
const remove = (db, collectionName, id) =>{
    const operacoes = db.collection(collectionName)
    new Promise((resolve, reject) =>{
      operacoes.deleteOne({ _id: new ObjectID(id) }, (err, result) =>{
      if(err){
        reject(err)
      }else{
        resolve(result)
      }
    })
  })
}
const update = (db, collectionName, id, values) => {
    const collection = db.collection(collectionName)
    return new Promise((resolve, reject) => {
      collection.updateOne(
        { _id: new ObjectID(id) }, // condicao
        { $set: values }, // quais valores novos
        (err, result) =>{
          if(err){
            reject(err)
          }else{
            resolve(result)
          }
        })
    })
}

const subtotal = operacoes => {
  let sub = 0
  return operacoes.map( operacao => {
    sub += operacao.valor
    let newOperacao = {
      _id: operacao._id,
      valor: operacao.valor,
      descricao: operacao.descricao,
      sub: sub
    }
    return newOperacao
  })
}

app.get('/operacoes/delete/:id', async (req, res) => {
  await remove(app.db, 'operacoes', req.params.id)
  res.redirect('/operacoes')
})

app.get('/operacoes/edit/:id', async(req, res) => {
  const conditions = {
    _id: new ObjectID(req.params.id)
  }
  const operacoes = await find(app.db, 'operacoes', conditions)
  if(operacoes.length === 0){
    res.redirect('/operacoes')
  }else{
    res.render('edit-operacao', { operacao: operacoes[0] })
  }
})

app.post('/operacoes/edit/:id', async (req, res) =>{
  const conditions = {
    _id: new ObjectID(req.params.id)
  }
  const operacoes = await find(app.db, 'operacoes', conditions)
  if(operacoes.length === 0){
    res.redirect('/operacoes')
  }else{
    await update(app.db, 'operacoes', req.params.id, req.body)
    res.redirect('/operacoes')
  }
})

app.get('/operacoes', async (req, res) => {
  let conditions = {}
  if(req.query.tipo && req.query.tipo === 'entradas'){
    conditions = {
      valor: { $gte: 0 } // greater then equal
    }
  }else if(req.query.tipo && req.query.tipo === 'saidas'){
    conditions = {
      valor: { $lt: 0 } // less then
    }
  }
  const operacoes = await find(app.db, 'operacoes', conditions)
  const newOperacoes = subtotal(operacoes)
  res.render('operacoes', { operacoes: newOperacoes })
})



// mostrar formulario
app.get('/nova-operacao', (req, res) => res.render('nova-operacao'))
app.post('/nova-operacao', async (req, res) => {
  const operacao = {
    descricao: req.body.descricao,
    valor: parseFloat(req.body.valor)
  }
  const newOperacao = await insert(app.db, 'operacoes', operacao)
  res.redirect('/operacoes')
})

MongoClient.connect(mongoUri, (err, db) => {
  if(err){
    return
  }else{
    app.db = db
    app.listen(port, () => console.log('Server running...'))
  }
})






