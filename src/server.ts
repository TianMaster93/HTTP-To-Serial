import * as express from 'express';
import { SerialRequest } from './serial-request';

const PORT = 12345;
const app  = express();

app.use(express.json());
app.post('/serial', async (req, res) => {
    try {
        await SerialRequest.Execute(req);
        res.json({
            status: true
        });
    } catch (err) {
        res.json({
            status: false,
            message: err.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`SERVER STARTED. PORT ${PORT}`);
});