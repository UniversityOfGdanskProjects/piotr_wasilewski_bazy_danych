const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'Description',
  },
  host: 'localhost:2020',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js'];
swaggerAutogen(outputFile, endpointsFiles, doc)
.then(() => {
    require('./server.js')
});