import 'isomorphic-fetch';
import 'dotenv/config';

import express from 'express';
import bodyParser from 'body-parser';

import { HttpAgent, Actor } from '@dfinity/agent';
import { IDL } from '@dfinity/candid';
import { idlFactory } from './.dfx/local/canisters/duckdashgem/duckdashgem.did.js';

const app = express();
const API_PORT = process.env.API_PORT;
const DFX_SERVER_PORT = process.env.DFX_SERVER_PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

BigInt.prototype.toJSON = function () {
  return Number(this);
};

const agent = new HttpAgent({
  host: `http://127.0.0.1:${DFX_SERVER_PORT}`,
});
agent.fetchRootKey();
global.ic = { agent, HttpAgent, IDL };

const actor = Actor.createActor(idlFactory, {
  canisterId: process.env.DUCKDASHGEM_CANISTER_ID,
});

app.post('/api/wallet', async (req, res, next) => {
  try {
    const userID = req.body.userID || '';
    await actor.initGemWallet(userID);

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

app.put('/api/wallet', async (req, res, next) => {
  try {
    const { userID, amount } = req.body;

    const currentGem = await actor.addGem(userID, amount);

    res.json({
      success: true,
      data: {
        currentGem,
      },
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/wallet', async (req, res, next) => {
  try {
    const userID = req.query.userID || '';
    const currentGem = await actor.getGemWallet(userID);

    res.json({
      success: true,
      data: {
        currentGem,
      },
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/transfer', async (req, res, next) => {
  try {
    const fromUserID = req.body.fromUserID || '';
    const toUserID = req.body.toUserID || '';
    const amount = req.body.amount || 0;

    const currentGem = await actor.transferGem(fromUserID, toUserID, amount);

    res.json({
      success: true,
      data: {
        currentGem,
      },
    });
  } catch (error) {
    next(error);
  }
});

app.use((error, _request, response, _next) => {
  const errorMessage = error.message.split("Reject text: ")[1];

  response.status(400).json({
    success: false,
    message: errorMessage,
  });
});

app.listen(API_PORT, () => {
  console.log(`DFX API server started at http://localhost:${API_PORT}`);
});
