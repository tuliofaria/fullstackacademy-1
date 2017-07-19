const http = require('http')
const port = 3000

const handler = (request, response) => {
  console.log(request.url)
  response.end('Fullstack Academy')
}

const server = http.createServer(handler)
server.listen(port, (err) => {
  if(err){
    console.log(err)
  }else{
    console.log('Fullstack Academy Server running on '+ port)
  }
})
