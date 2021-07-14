import express from 'express';
import { MockFactory } from '../mooks/factory/MockFactory';
import * as bodyParser from 'body-parser';
import * as multer from 'multer';
import { BusinessErrorDTO } from '../core/dto/BusinessErrorDTO';


const app = express();
const PORT = 3000;

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

const mockFactory = new MockFactory();
let service = mockFactory.buildService();

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.post('/Restart', (req, res) => {
  service = mockFactory.buildService();
  res.json("Restart exchange rates success!")
});

app.post('/QueryExchangeRate', (req, res) => {
    const { OriginalCurrencyCode, TargetCurrencyCode } = req.body;
    const result = service.QueryExchangeRate(OriginalCurrencyCode, TargetCurrencyCode);

    if (result instanceof BusinessErrorDTO)
      res.statusCode = 500;

    res.json(result);
});

app.post('/ExchangeCurrency', (req, res) => {
    const { OriginalCurrencyCode, TargetCurrencyCode, Amount } = req.body;
    const result = service.ExchangeCurrency(OriginalCurrencyCode, TargetCurrencyCode, Amount);

    if (result instanceof BusinessErrorDTO)
      res.statusCode = 500;

    res.json(result);
});

app.post('/QueryExchangeBalances', (req, res) => {
  const result = service.QueryExchangeBalances();
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Express with Typescript! http://localhost:${PORT}`);
});