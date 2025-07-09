const express = require('express');
const sql = require('mssql');
const cors = require('cors');
require('dotenv').config();
const http = require('http');
const axios = require('axios');
const pLimit = require('p-limit').default;
const fs = require('fs');
const csv = require('csv-parser');
const app = express();
app.use(cors());
app.use(express.json());
const WebSocket = require('ws');
app.use('/images', express.static('//adminserver/H/All images/export'));
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// SQL Server config
// const config = {
//     user: 'sa',
//     password: 'Fashion@01',
//     server: 'ITADMIN',
//     // database: 'demo',
//     database: 'HeroPowerBi',
//     port: 1433,
//     options: {
//         encrypt: false, // true if using Azure
//         trustServerCertificate: true,
//         enableArithAbort: true,
//         driver: 'ODBC Driver 17 for SQL Server'
//     }
// };


// Config for "demo" database

const configDemo = {
  user: 'sa',
  password: 'Fashion@01',
  server: 'ITADMIN',
  database: 'demo',
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    driver: 'ODBC Driver 17 for SQL Server',
  },
};

// Config for "HeroPowerBi" database
const configHero = {
  user: 'sa',
  password: 'Fashion@01',
  server: 'ITADMIN',
  database: 'HeroPowerBi',
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    driver: 'ODBC Driver 17 for SQL Server',
  },
};




// const getImageAsBase64 = async (url) => {
//   if (!url) return null;

//   try {
//     const response = await axios.get(url, {
//       responseType: 'arraybuffer',
//       timeout: 700, // milliseconds
//       auth: {
//         username: "webuser",
//         password: "Herofashion@123",
//       },
//     });

//     const contentType = response.headers['content-type'] || 'image/jpeg';
//     const base64 = Buffer.from(response.data).toString('base64');
//     return `data:${contentType};base64,${base64}`;
//   } catch (error) {
//     console.warn(`⚠️ Skipped image: ${url} (${error.code || error.message})`);
//     return null; // Gracefully handle timeout/errors
//   }
// };


// app.use('/images', express.static('C:/Users/administrator.HEROFASHION/Documents/dhana/data.csv'));

const images = [
  {
    id: 1,
    name: "John Doe",
    image: "http://10.1.21.13:7001/images/12527.jpg"
  },
  {
    id: 2,
    name: "Jane Smith",
    image: "https://via.placeholder.com/100x100?text=Jane"
  },
  {
    id: 3,
    name: "Alex Hero",
    image: "https://images.herofashion.com/sample/image1.jpg"
  }
];


app.get('/api/sample', (req, res) => {
  res.json({ success: true, data: images });
});


const csvFilePath = 'C:/Users/administrator.HEROFASHION/Documents/dhana/data.csv';
// const csvFilePath = 'C:/Users/administrator.HEROFASHION/Documents/dhana/data1.xlsx';

// ✅ API route to serve CSV data as JSON
app.get('/api/csvdata', (req, res) => {
  const results = [];

  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on('data', (row) => results.push(row))
    .on('end', () => {
      res.json({ success: true, data: results });
    })
    .on('error', (err) => {
      console.error('❌ Error reading CSV:', err.message);
      res.status(500).json({ success: false, message: 'Failed to read CSV file' });
    });
});


const getImageAsBase64 = async (url) => {
  if (!url || !url.startsWith('http')) return null;
  const cleanedUrl = url.trim().replace(/\s/g, '%20');

  try {
    const response = await axios.get(cleanedUrl, {
      responseType: 'arraybuffer',
      auth: {
        username: process.env.IMAGE_USER || 'webuser',
        password: process.env.IMAGE_PASS || 'Herofashion@123',
      },
      headers: {
        'User-Agent': 'Mozilla/5.0',
        Accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
        Referer: 'https://images.herofashion.com/',
      },
    });

    const contentType = response.headers['content-type'] || 'image/jpeg';
    const base64 = Buffer.from(response.data).toString('base64');
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    console.warn(`⚠️ Image fetch failed: ${cleanedUrl} — ${error.message}`);
    return null;
  }
};

// const pLimit = require('p-limit');
const limit = pLimit(5); // max 5 concurrent image fetches

app.get('/api/employee', async (req, res) => {
  try {
    await sql.connect(configDemo);

    const page = parseInt(req.query.page || '1');
    const pageSize = parseInt(req.query.pageSize || '20');
    const offset = (page - 1) * pageSize;

    const countQuery = `
      SELECT COUNT(*) AS totalCount
      FROM testerphero.dbo.txOrderDetStyles a
      INNER JOIN testerphero.dbo.txOrdDetStylzUDFs b 
        ON a.OrderNo = b.OrderNo
      WHERE b.ItemID = 51 AND b.Value = 'R' AND a.ShipmentCompleted = 0
    `;

    const dataQuery = `
     WITH OrderedData AS (
  SELECT 
    a.OrderNo,
    a.PONo,
    a.PODate,
    bb.Name,
    'http://103.125.155.133:7001/images/' + REPLACE(REPLACE(a.No, 'H', ''), 'J', '') + '.jpg' AS ImageOrder,
    ROW_NUMBER() OVER (ORDER BY a.OrderNo) AS RowNum
  FROM testerphero.dbo.txOrderDetStyles a
  INNER JOIN testerphero.dbo.txOrdDetStylzUDFs b 
    ON a.OrderNo = b.OrderNo
  INNER JOIN testerphero.dbo.mBuyers bb 
    ON bb.ID = a.CustomerID
  WHERE b.ItemID = 51 AND b.Value = 'R' AND a.ShipmentCompleted = 0
)
SELECT OrderNo, ImageOrder, PONo, PODate, Name
FROM OrderedData
WHERE RowNum BETWEEN ${offset + 1} AND ${offset + pageSize}
    `;

    const [countResult, dataResult] = await Promise.all([
      sql.query(countQuery),
      sql.query(dataQuery)
    ]);

    const totalCount = countResult.recordset[0].totalCount;

    res.json({
      success: true,
      page,
      pageSize,
      totalCount,
      data: dataResult.recordset,
    });

  } catch (err) {
    console.error('❌ SQL error:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});




// // Route: API to fetch images and enrich with base64
// app.get('/api/image', async (req, res) => {
//   try {
//     await sql.connect(configHero);
//     const result = await sql.query('SELECT TOP 10 * FROM Print_RGB_Alt');

//     const enrichedData = await Promise.all(
//       result.recordset.map(async (item) => {
//         const securePhoto = await getImageAsBase64(item.Image_tb);
//         const securePhoto1 = await getImageAsBase64(item.Img_Print);
//         const securePhoto2 = await getImageAsBase64(item.Img_Print_MMT);
//         return {
//           ...item,
//           securePhoto, // Base64 string or null fallback
//           securePhoto1,
//           securePhoto2,
//         };
//       })
//     );

//     res.json({ success: true, data: enrichedData });
//   } catch (err) {
//     console.error('❌ SQL error:', err);
//     res.status(500).json({ success: false, message: 'Database error' });
//   }
// });



app.get('/api/image', async (req, res) => {
    try {
        await sql.connect(configHero);
        // const result = await sql.query('SELECT * FROM EmpwiseSal');
        const result = await sql.query('SELECT * FROM Print_RGB_Alt');
        res.json(result.recordset);
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Database error');
    }
});


// app.get('/api/tbuyer', async (req, res) => {
//     try {
//         await sql.connect(configDemo);
//         // const result = await sql.query('SELECT * FROM EmpwiseSal');
//         const result = await sql.query('SELECT * FROM T_Buyer');
//         res.json(result.recordset);
//     } catch (err) {
//         console.error('SQL error', err);
//         res.status(500).send('Database error');
//     }
// });


wss.on('connection', (ws) => {
  console.log('Client connected via WebSocket');

  const sendBuyers = async () => {
    try {
      await sql.connect(configDemo);
      const result = await sql.query('SELECT * FROM T_Buyer');
      ws.send(JSON.stringify({ type: 'BUYER_DATA', data: result.recordset }));
    } catch (err) {
      console.error('SQL error', err);
      ws.send(JSON.stringify({ type: 'ERROR', message: 'Database error' }));
    }
  };

  // Initial send
  sendBuyers();

  // Periodic update (optional)
  const interval = setInterval(sendBuyers, 10000); // every 10 seconds

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});


// // API to get buyer by ID
// app.get('/api/buyers/:id', async (req, res) => {
//     const buyerId = req.params.id;
//     try {
//         await sql.connect(config);
//         const result = await sql.query`SELECT * FROM T_Buyer WHERE BuyerID = ${buyerId}`;
//         res.json(result.recordset[0]);
//     } catch (err) {
//         console.error('SQL error', err);
//         res.status(500).send('Database error');
//     }
// });


// Start server
const PORT = 7001;
app.listen(PORT, () => {
    console.log(`Server running at http://103.125.155.133:${PORT}`);
});