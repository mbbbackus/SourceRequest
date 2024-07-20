import express from 'express';
import axios from 'axios';
import { parse } from 'node-html-parser';

import cors from 'cors';
const app = express();

app.use(cors());

app.listen(4000, () => {
    console.log("Server running on port 4000");
})

