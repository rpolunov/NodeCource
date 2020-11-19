const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const fs = require('fs');
const csvModule = require('csvtojson');
const { Parser } = require('json2csv');
const { v4: uuidv4 } = require('uuid');


app.get('/events', async (req, res) => {
    try {
        console.log('GET request for "/events" endpoint resived');
        const fileContent = await csvModule().fromFile('test.csv');
        const parameter = req.query.location;
        if (parameter) {
            return res.json(fileContent.filter(({ location }) => location.toLowerCase() === parameter.toLowerCase()));
        }
        return res.json(fileContent);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})


app.get('/events/:eventId', async (req, res) => {
    try {
        const fileContent = await csvModule().fromFile('test.csv');
        const parameterId = req.params.eventId;
        console.log(`GET request for "/events" endpoint and eventId = ${parameterId} resived`);
        return res.json(fileContent.find(({ Id }) => Id === parameterId));
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})

app.delete('/events/:eventId', async (req, res) => {
    try {
        const fileContent = await csvModule().fromFile('test.csv');

        let headers = Object.keys(fileContent[0]);
        const parameterId = req.params.eventId;
        console.log(`DELETE request for "/events" endpoint and eventId = ${parameterId} resived`);

        let obj = fileContent.find(x => x.Id === parameterId);
        let index = fileContent.indexOf(obj);

        if (index >= 0) {
            console.log('not empty');
            fileContent.splice(index, 1);

            writeToFile(fileContent, headers);

            return res.json(fileContent);

        } else {
            console.log('empty');
            return res.json(fileContent);
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.post('/events', async (req, res) => {
    try {
        const fileContent = await csvModule().fromFile('test.csv');
        let headers = Object.keys(fileContent[0]);
        const obj = req.body;
        console.log(`POST request for "/events" endpoint and body = ${JSON.stringify(obj)} resived`);

        if (obj.length > 0) {
            obj.forEach(element => {
                element.Id = uuidv4();
                fileContent.push(element);
                writeToFile(fileContent, headers);
            });
        } else {
            obj.Id = uuidv4();
            fileContent.push(obj);
            writeToFile(fileContent, headers);
        }
        return res.json(obj);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }

});

app.put('/events/:eventId', async (req, res) => {
    try {
        const parameterId = req.params.eventId;
        let fileContent = fs.readFileSync("test.csv", "utf8");
        const newStr1 = parameterId + ',' + req.body.event + ',' + req.body.field1 + ',' + req.body.field2 + ',' + req.body.location;

        console.log(`PUT request for "/events" endpoint and eventID = ${parameterId} and body = ${JSON.stringify(req.body)} resived`);

        const find = new RegExp(`^${parameterId}.+$`, 'm');
        let newStr = fileContent.replace(find, newStr1);
        fs.writeFileSync('test.csv', newStr);
        return res.json(parameterId);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }

});

app.get('/events-batch', (req, res) => {
    try {
        const readStream = fs.createReadStream('test.csv');
        readStream.pipe(csvModule()).pipe(res);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})

app.listen(3000, () => {
    console.log('server start at port 3000'); //the server object listens on port 3000
});


function writeToFile(fileContent, headers) {
    const options = { headers, quote: '' };
    const parser = new Parser(options);
    const newFileContent = parser.parse(fileContent) + '\n';
    fs.writeFileSync('test.csv', newFileContent);
}