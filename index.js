const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');
const slugify = require('slugify');



// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');

// console.log(textIn)
// const textOut = `'this is '+${textIn}.\n Created on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('file written')

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     console.log(data1);
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => { 
//         console.log(data2);
//         fs.writeFile(`./txt/final.txt`,`${data1}\n${data2}`,'utf-8',err=>{
//             console.log('Your file has been written')
//         })

//     })
// })

// console.log('will read file')




//SERVER




const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8')

const dataObj = JSON.parse(data);

const slugs = dataObj.map(el=> slugify(el.productName,{lower:true}));
console.log(slugs)

const server = http.createServer((req, res) => {

    const {query,pathname} = url.parse(req.url,true);

    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html'});
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard,el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARD%}',cardsHtml)
        res.end(output);
    } else if (pathname === '/product') {
        res.writeHead(200,{'Content-type':'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct,product);
        res.end(output)
    } else if (pathname === '/api') {

        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(data)

    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world',
        })
        res.end('<h1>Page not found!</h1>');
    }
})

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000')
})