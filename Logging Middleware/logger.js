import dotenv from 'dotenv';

dotenv.config();
import axios from "axios";


const logging = async (stack, level, pack, message) => {
    try {
        const obj = { "stack":stack, "level":level, "package": pack, "message":message };
        const url = process.env.LOGGING_URL;
        const key = process.env.ACCESS_KEY;

        if (!url) {
            throw new Error("LOGGING_URL not set in .env");
        }
        if (!key) {
            throw new Error("ACCESS_KEY not set in .env");
        }

        const response = await axios.post(url, obj, {
            headers: { Authorization: `Bearer ${key}` }
        });

        if (!response) {
            console.log('Empty data');
        } else {
            console.log('Log sent successfully', response.status);
        }
    } catch (err) {
        if (err.response) {
            console.log('Error response:', err.response.status, err.response.data);
        } else {
            console.log(`Error detected : ${err}`);
        }
    }
};

export default logging;
