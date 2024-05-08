const http = require('http');

// Global variables
const windowSize = 10;
let windowNumbers = [];
const testServerHostname = "20.244.56.144"; 
const testServerPaths = {
    'p': "/test/primes",
    'f': "/test/fibo",
    'e': "/test/even",
    'r': "/test/random"
};

// Function to fetch numbers from the test server
const fetchNumbers = async (numberid) => {
    var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE1MTY2NzA1LCJpYXQiOjE3MTUxNjY0MDUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjZlNmE5ZjE3LTYzMzYtNDg0Ni1iZGNiLThlMjE4YjFiNWU0ZiIsInN1YiI6Inlhc2htZWhldHJlaXRAc2Fuaml2YW5pY29lLm9yZy5pbiJ9LCJjb21wYW55TmFtZSI6InNhbmppdmFuaSIsImNsaWVudElEIjoiNmU2YTlmMTctNjMzNi00ODQ2LWJkY2ItOGUyMThiMWI1ZTRmIiwiY2xpZW50U2VjcmV0IjoibGlvdFFOek1Ka2tQZGVoaiIsIm93bmVyTmFtZSI6Ik1laGV0cmUgWWFzaCBQcml0YW0iLCJvd25lckVtYWlsIjoieWFzaG1laGV0cmVpdEBzYW5qaXZhbmljb2Uub3JnLmluIiwicm9sbE5vIjoiVUlUMjFNMTA0MCJ9.vfDTSj4Aoubkrd-ep6DBjwUD_pf5ox6iI3877hZjcbw");

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

const data = fetch(`http://20.244.56.144/test/${testServerPaths[numberid]}`, requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
  console.log(data);
};


// Function to calculate average of numbers in window
const calculateAverage = () => {
    if (windowNumbers.length === 0) return 0;
    return windowNumbers.reduce((sum, num) => sum + num, 0) / windowNumbers.length;
};

// Middleware to handle incoming requests
// const handleNumbers = async (req, res) => {
//     const { numberid } = req.query;

//     if (!testServerPaths[numberid]) {
//         return res.status(400).json({ error: "Invalid numberid provided" });
//     }

//     try {
//         const startTime = Date.now();
//         console.log(startTime);
//         const numbers = await fetchNumbers(numberid);
//         console.log(numbers);
//         const endTime = Date.now();

//         // Check if response is received within 500 ms
//         if ((endTime - startTime) > 500) {
//             return res.status(500).json({ error: "Timeout exceeded while fetching numbers from test server" });
//         }

//         // Update window numbers
//         windowNumbers.push(...numbers);
//         windowNumbers = Array.from(new Set(windowNumbers)); // Remove duplicates
//         if (windowNumbers.length > windowSize) {
//             windowNumbers = windowNumbers.slice(-windowSize); // Trim to window size
//         }

//         // Prepare response
//         const response = {
//             numbers,
//             windowPrevState: [],
//             windowCurrState: windowNumbers,
//             avg: calculateAverage()
//         };

//         res.json(response);
//     } catch (error) {
//         console.error("Error handling numbers:", error);
//         res.status(500).json({ error: "Failed to fetch numbers from test server" });
//     }
// };
const handleNumbers = async (req, res) => {
    const { numberid } = req.query;

    if (!testServerPaths[numberid]) {
        return res.status(400).json({ error: "Invalid numberid provided" });
    }

    try {
        const startTime = Date.now();
        const numbers = await fetchNumbers(numberid);
        const endTime = Date.now();

        // Check if response is received within 500 ms
        if ((endTime - startTime) > 500) {
            return res.status(500).json({ error: "Timeout exceeded while fetching numbers from test server" });
        }

        // Update window numbers
        windowNumbers.push(...numbers);
        windowNumbers = Array.from(new Set(windowNumbers)); // Remove duplicates
        if (windowNumbers.length > windowSize) {
            windowNumbers = windowNumbers.slice(-windowSize); // Trim to window size
        }

        // Prepare response
        const response = {
            numbers,
            windowPrevState: [],
            windowCurrState: windowNumbers,
            avg: calculateAverage()
        };

        res.json(response);
    } catch (error) {
        console.error("Error handling numbers:", error);
        res.status(500).json({ error: "Failed to fetch numbers from test server" });
    }
}

module.exports = { handleNumbers };
