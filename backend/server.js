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

// const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });


process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';



const server11DB = {
  user: 'sa',
  password: 'Fashion@01',
  // server: 'ITADMIN',
  server: '10.1.21.11',
  database: 'demo',
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    driver: 'ODBC Driver 17 for SQL Server',
  },
};

// Config for "demo" database

const configDemo = {
  user: 'sa',
  password: 'Fashion@01',
  server: 'ITADMIN',
  // server: '10.1.21.11',
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
  // server: '10.1.21.11',
  database: 'HeroPowerBi',
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
    driver: 'ODBC Driver 17 for SQL Server',
  },
};





// Config for "HeroPowerBi" database
const configHero11 = {
  user: 'sa',
  password: 'Fashion@01',
  // server: 'ITADMIN',
  server: '10.1.21.11',
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

// ✅ Create HTTP server separately
const server = http.createServer(app);

// ✅ Attach WebSocket to same HTTP server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('🟢 Client connected via WebSocket');

  ws.on('close', () => {
    console.log('🔴 Client disconnected');
  });

  ws.on('error', (err) => {
    console.error('❌ WebSocket error', err);
  });
});

// ✅ Start server
const PORT = 7001;
server.listen(PORT, () => {
  console.log(`✅ Server running at http://103.125.155.133:${PORT}`);
});


function broadcast(data) {
  const message = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}


let lastSeenOrderNoDemo = null;
let lastSeenOrderNo11 = null;


// API to get all data
app.get('/api/employee', async (req, res) => {
  try {
    await sql.close();
    await sql.connect(configDemo);
    const query = `
      SELECT 
        a.OrderNo,
        a.PONo,
        a.PODate,
        bb.Name,
        'http://103.125.155.133:7001/images/' + REPLACE(REPLACE(a.No, 'H', ''), 'J', '') + '.jpg' AS ImageOrder
      FROM testerphero.dbo.txOrderDetStyles a
      INNER JOIN testerphero.dbo.txOrdDetStylzUDFs b 
        ON a.OrderNo = b.OrderNo
      INNER JOIN testerphero.dbo.mBuyers bb 
        ON bb.ID = a.CustomerID
      WHERE b.ItemID = 51 AND b.Value = 'R' AND a.ShipmentCompleted = 0
    `;
    const result = await sql.query(query);
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    console.error('❌ SQL Error:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// 🔁 Polling: check for new row every 5 seconds
async function pollNewDataDemo() {
  try {
    await sql.close();
    await sql.connect(configDemo);
    const query = `
      SELECT TOP 1 
        a.OrderNo,
        a.PONo,
        a.PODate,
        bb.Name,
        'http://103.125.155.133:7001/images/' + REPLACE(REPLACE(a.No, 'H', ''), 'J', '') + '.jpg' AS ImageOrder
      FROM testerphero.dbo.txOrderDetStyles a
      INNER JOIN testerphero.dbo.txOrdDetStylzUDFs b ON a.OrderNo = b.OrderNo
      INNER JOIN testerphero.dbo.mBuyers bb ON bb.ID = a.CustomerID
      WHERE b.ItemID = 51 AND b.Value = 'R' AND a.ShipmentCompleted = 0
      ORDER BY a.OrderNo DESC
    `;
    const result = await sql.query(query);
    const latest = result.recordset[0];

    if (latest && latest.OrderNo !== lastSeenOrderNoDemo) {
      lastSeenOrderNoDemo = latest.OrderNo;
      console.log("🆕 [Demo DB] New Order:", latest.OrderNo);
      broadcast({ type: "new", item: latest });
    }
  } catch (err) {
    console.error("❌ [Demo DB] Polling error:", err);
  }
}




// API to get all data
app.get('/api/employees11', async (req, res) => {
  try {
    await sql.close();
    await sql.connect(server11DB);
    const query = `
      SELECT 

FORMAT(a.finaldelvdate, 'yyyy-MM-dd') as [Final_Year_delivery1],
        a.OrderNo,
        a.PONo,

	format(a.FinalDelvDate,'dd-MM-yyyy')FinalDelvDate,
	g.Value UDF46,u125.Value as u125,u1.Value as u1,
        a.PODate,
        bb.Name,
        'http://103.125.155.133:7001/images/' + REPLACE(REPLACE(a.No, 'H', ''), 'J', '') + '.jpg' AS ImageOrder
      FROM testerphero.dbo.txOrderDetStyles a
      INNER JOIN testerphero.dbo.txOrdDetStylzUDFs b 
        ON a.OrderNo = b.OrderNo
      INNER JOIN testerphero.dbo.mBuyers bb 
        ON bb.ID = a.CustomerID
		inner join(

		SELECT     ItemID, Value, OrderNo
FROM         testerphero.dbo.txOrdDetStylzUDFs
WHERE     (ItemID = 47) 
) g on g.OrderNo=b.OrderNo

inner join(
SELECT     ItemID, Value, OrderNo
FROM         testerphero.dbo.txOrdDetStylzUDFs
WHERE     (ItemID = 125)
) u125 on b.OrderNo=u125.OrderNo

inner join(
SELECT     ItemID, Value, OrderNo
FROM         testerphero.dbo.txOrdDetStylzUDFs
WHERE     (ItemID = 1)
) u1 on b.OrderNo=u1.OrderNo

      WHERE b.ItemID = 51 and   b.Value = 'R' or b.itemid=47  AND a.ShipmentCompleted = 0
    `;
    const result = await sql.query(query);
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    console.error('❌ SQL Error:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// 🔁 Polling: check for new row every 5 seconds
// let lastSeenOrderNo = null;
async function pollNewDataServer11() {
  try {
    await sql.close();
    await sql.connect(server11DB);
    const query = `
      SELECT TOP 1 
FORMAT(a.finaldelvdate, 'yyyy-MM-dd') as [Final_Year_delivery1],
        a.OrderNo,
        a.PONo,

	format(a.FinalDelvDate,'dd-MM-yyyy')FinalDelvDate,
	g.Value UDF46,u125.Value as u125,u1.Value as u1,
        a.PODate,
        bb.Name,
        'http://103.125.155.133:7001/images/' + REPLACE(REPLACE(a.No, 'H', ''), 'J', '') + '.jpg' AS ImageOrder
      FROM testerphero.dbo.txOrderDetStyles a
      INNER JOIN testerphero.dbo.txOrdDetStylzUDFs b 
        ON a.OrderNo = b.OrderNo
      INNER JOIN testerphero.dbo.mBuyers bb 
        ON bb.ID = a.CustomerID
		inner join(

		SELECT     ItemID, Value, OrderNo
FROM         testerphero.dbo.txOrdDetStylzUDFs
WHERE     (ItemID = 47) 
) g on g.OrderNo=b.OrderNo

inner join(
SELECT     ItemID, Value, OrderNo
FROM         testerphero.dbo.txOrdDetStylzUDFs
WHERE     (ItemID = 125)
) u125 on b.OrderNo=u125.OrderNo

inner join(
SELECT     ItemID, Value, OrderNo
FROM         testerphero.dbo.txOrdDetStylzUDFs
WHERE     (ItemID = 1)
) u1 on b.OrderNo=u1.OrderNo

      WHERE b.ItemID = 51 and   b.Value = 'R' or b.itemid=47  AND a.ShipmentCompleted = 0
      ORDER BY a.OrderNo DESC
    `;
    const result = await sql.query(query);
    const latest = result.recordset[0];

    if (latest && latest.OrderNo !== lastSeenOrderNo11) {
      lastSeenOrderNo11 = latest.OrderNo;
      console.log("🆕 [Server11 DB] New Order:", latest.OrderNo);
      broadcast({ type: "new", item: latest });
    }
  } catch (err) {
    console.error("❌ [Server11 DB] Polling error:", err);
  }
}



app.get('/api/new-Query', async (req, res) => {
  try {
    await sql.close();
    await sql.connect(server11DB);
    const query = `
      SELECT 

FORMAT(a.finaldelvdate, 'yyyy-MM-dd') as [Final_Year_delivery1],
        a.OrderNo,
        a.PONo,

	format(a.FinalDelvDate,'dd-MM-yyyy')FinalDelvDate,
	b.ItemID,b.value,
        a.PODate,
        bb.Name,
        'http://103.125.155.133:7001/images/' + REPLACE(REPLACE(a.No, 'H', ''), 'J', '') + '.jpg' AS ImageOrder
      FROM testerphero.dbo.txOrderDetStyles a
      INNER JOIN testerphero.dbo.txOrdDetStylzUDFs b 
        ON a.OrderNo = b.OrderNo
      INNER JOIN testerphero.dbo.mBuyers bb 
        ON bb.ID = a.CustomerID
      WHERE b.ItemID = 51 and   b.Value = 'R' or b.itemid=47 and isnull(b.value,'')='' AND a.ShipmentCompleted = 0
    `;
    const result = await sql.query(query);
    res.json({ success: true, data: result.recordset });
  } catch (err) {
    console.error('❌ SQL Error:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// 🔁 Polling: check for new row every 5 seconds
// let lastSeenOrderNo = null;
async function pollNewServer11() {
  try {
    await sql.close();
    await sql.connect(server11DB);
    const query = `
      SELECT TOP 1 
FORMAT(a.finaldelvdate, 'yyyy-MM-dd') as [Final Year delivery1],
        a.OrderNo,
        a.PONo,

	format(a.FinalDelvDate,'dd-MM-yyyy')FinalDelvDate,
	b.ItemID,b.value,
        a.PODate,
        bb.Name,
        'http://103.125.155.133:7001/images/' + REPLACE(REPLACE(a.No, 'H', ''), 'J', '') + '.jpg' AS ImageOrder
      FROM testerphero.dbo.txOrderDetStyles a
      INNER JOIN testerphero.dbo.txOrdDetStylzUDFs b 
        ON a.OrderNo = b.OrderNo
      INNER JOIN testerphero.dbo.mBuyers bb 
        ON bb.ID = a.CustomerID
      WHERE b.ItemID = 51 and   b.Value = 'R' or b.itemid=47 and isnull(b.value,'')='' AND a.ShipmentCompleted = 0
      ORDER BY a.OrderNo DESC
    `;
    const result = await sql.query(query);
    const latest = result.recordset[0];

    if (latest && latest.OrderNo !== lastSeenOrderNo11) {
      lastSeenOrderNo11 = latest.OrderNo;
      console.log("🆕 [Server11 DB] New Order:", latest.OrderNo);
      broadcast({ type: "new", item: latest });
    }
  } catch (err) {
    console.error("❌ [Server11 DB] Polling error:", err);
  }
}



// Start polling
setInterval(pollNewDataDemo, 5000);     // configDemo DB
setInterval(pollNewDataServer11, 5000); // server11DB
setInterval(pollNewServer11, 5000); // server11DB


app.post('/api/orders', async (req, res) => {
  const { OrderNo, PONo, PODate, Name, Final_Year_delivery1, FinalDelvDate, ItemID, Value } = req.body;
  try {
    await sql.connect(server11DB);
    await sql.query(`
      INSERT INTO testerphero.dbo.txOrderDetStyles (OrderNo, PONo, PODate, FinalDelvDate, No, CustomerID, ShipmentCompleted)
      VALUES ('${OrderNo}', '${PONo}', '${PODate}', '${FinalDelvDate}', '${OrderNo}', 1, 0);

      INSERT INTO testerphero.dbo.txOrdDetStylzUDFs (OrderNo, ItemID, Value)
      VALUES ('${OrderNo}', ${ItemID}, '${Value}');
    `);
    res.json({ success: true, message: 'Order added successfully' });
  } catch (err) {
    console.error('❌ Insert Error:', err);
    res.status(500).json({ success: false });
  }
});

app.put("/api/editorders/:orderNo", async (req, res) => {
  const { orderNo } = req.params;
  const { PONo, PODate, FinalDelvDate, ItemID, Value } = req.body;

  console.log("Update request body:", req.body);
  console.log("OrderNo:", orderNo);

  try {
    await sql.connect(server11DB);
    const request = new sql.Request();

    request.input("PONo", sql.NVarChar, PONo);
    request.input("PODate", sql.Date, PODate);
    request.input("FinalDelvDate", sql.Date, FinalDelvDate);
    request.input("OrderNo", sql.NVarChar, orderNo);
    request.input("ItemID", sql.Int, ItemID);
    request.input("Value", sql.NVarChar, Value);

    await request.query(`
      UPDATE testerphero.dbo.txOrderDetStyles
      SET PONo = @PONo, PODate = @PODate, FinalDelvDate = @FinalDelvDate
      WHERE OrderNo = @OrderNo;

      UPDATE testerphero.dbo.txOrdDetStylzUDFs
      SET Value = @Value
      WHERE OrderNo = @OrderNo AND ItemID = @ItemID;
    `);

    res.json({ success: true, message: "Order updated" });
  } catch (err) {
    console.error("❌ Update Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});


// ✅ Full working update endpoint with validation and fallback insert for UDFs
app.put('/api/employees11/:OrderNo', async (req, res) => {
  try {
    const { OrderNo } = req.params;
    const { PONo, PODate, Name, u125, u1, UDF46 } = req.body;

    console.log("📝 Update payload:", { OrderNo, PONo, PODate, Name, u125, u1, UDF46 });

    await sql.connect(server11DB);

    // ✅ Update core table
    await sql.query`
      UPDATE testerphero.dbo.txOrderDetStyles
      SET PONo = ${PONo}, PODate = ${PODate}
      WHERE OrderNo = ${OrderNo}
    `;

    // ✅ Update or insert UDF helper
    const upsertUDF = async (itemID, value) => {
      const check = await sql.query`
        SELECT COUNT(*) AS count FROM testerphero.dbo.txOrdDetStylzUDFs
        WHERE OrderNo = ${OrderNo} AND ItemID = ${itemID}
      `;

      if (check.recordset[0].count > 0) {
        await sql.query`
          UPDATE testerphero.dbo.txOrdDetStylzUDFs
          SET Value = ${value}
          WHERE OrderNo = ${OrderNo} AND ItemID = ${itemID}
        `;
      } else {
        await sql.query`
          INSERT INTO testerphero.dbo.txOrdDetStylzUDFs (OrderNo, ItemID, Value)
          VALUES (${OrderNo}, ${itemID}, ${value})
        `;
      }
    };

    await upsertUDF(47, UDF46);
    await upsertUDF(125, u125);
    await upsertUDF(1, u1);

    res.json({ success: true, message: "✅ Record updated successfully." });
  } catch (err) {
    console.error("❌ Update error:", err);
    res.status(500).json({ success: false, message: err.message || "Update failed" });
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
  console.log('🟢 Client connected via WebSocket');

  ws.on('close', () => {
    console.log('🔴 Client disconnected');
  });

  ws.on('error', (err) => {
    console.error('❌ WebSocket error:', err);
  });

  // Optional: Handle incoming message from client
  ws.on('message', (msg) => {
    console.log('📨 Received message:', msg.toString());
  });
});


app.get('/api/table-join-data', async (req, res) => {
    try {
      //  await sql.close();
        await sql.connect(configHero11);
        // const result = await sql.query('select * from Ord_Order_Oms a inner join [Ord_UDF Complete K] b on a.[Jobno Oms]=b.[Jobno UDF Complete]');
        const result = await sql.query(`
        SELECT a.*, b.*, a.[Image Order] AS ImageOrder
        FROM Ord_Order_Oms a
        INNER JOIN [Ord_UDF Complete K] b
        ON a.[Jobno_Oms] = b.[Jobno UDF Complete]
      `);
        res.json(result.recordset);
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).send('Database error');
    }
});



// app.put("/api/table-join-data/:OrderNo", async (req, res) => {
//   try {
//     const { OrderNo } = req.params;
//     const { styleid, PONo, ["008_Fabric"] : Fabric ,["046  Organic"]:Organic} = req.body;

//     if (!OrderNo || !styleid) {
//       return res.status(400).json({ error: "Missing OrderNo or styleid" });
//     }

//     await sql.close();
//     await sql.connect(configHero11);

//     const request1 = new sql.Request()
//       .input("styleid", sql.VarChar, styleid)
//       .input("PONo", sql.VarChar, PONo)
//       .input("OrderNo", sql.VarChar, OrderNo);

//     const result = await request1.query(`
//       UPDATE testerphero.dbo.txOrderDetStyles
//       SET styleid = @styleid, PONo = @PONo
//       WHERE OrderNo = @OrderNo
//     `);

//     const request2 = new sql.Request()
//       .input("Fabric", sql.VarChar, Fabric)
//       .input("Organic", sql.Int, parseInt(Organic))
//       .input("OrderNo", sql.VarChar, OrderNo);

//     const results = await request2.query(`
//       UPDATE testerphero.dbo.txOrdDetStylzUDFs
//       SET Value = @Fabric
//       WHERE OrderNo = @OrderNo AND ItemID = @Organic
//     `);

//     if (result.rowsAffected[0] === 0 && results.rowsAffected[0] === 0) {
//       return res.status(404).json({ error: "Record not found" });
//     }

//     res.status(200).json({ message: "Update successful" });
//   } catch (err) {
//     console.error("❌ SQL Update Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });



app.put("/api/table-join-data/:OrderNo", async (req, res) => {
  try {
    const { OrderNo } = req.params;
    const { styleid, PONo,["Final delivery date"]: finalDeliveryDate, ...udfFields } = req.body;

    if (!OrderNo || !styleid) {
      return res.status(400).json({ error: "Missing OrderNo or styleid" });
    }

    await sql.close();
    await sql.connect(configHero11);

    // Update txOrderDetStyles
    const request1 = new sql.Request()
      .input("styleid", sql.VarChar, styleid)
      .input("PONo", sql.VarChar, PONo)
      .input("OrderNo", sql.VarChar, OrderNo)
      .input("finalDeliveryDate", sql.VarChar,finalDeliveryDate);

    const result1 = await request1.query(`
      UPDATE testerphero.dbo.txOrderDetStyles
      SET styleid = @styleid, PONo = @PONo, FinalDelvDate =@finalDeliveryDate
      WHERE OrderNo = @OrderNo
    `);

    // Loop through each field like "008_Fabric", "046  Organic"
    for (const key in udfFields) {
      const value = udfFields[key];
      const match = key.match(/^(\d+)/); // Extract numeric prefix (ItemID)
      if (match) {
        const itemId = parseInt(match[1]);
        const request2 = new sql.Request()
          .input("OrderNo", sql.VarChar, OrderNo)
          .input("ItemID", sql.Int, itemId)
          .input("Value", sql.VarChar, value);

        await request2.query(`
          UPDATE testerphero.dbo.txOrdDetStylzUDFs
          SET Value = @Value
          WHERE OrderNo = @OrderNo AND ItemID = @ItemID
        `);
      }
    }

    res.status(200).json({ message: "✅ Update successful" });
  } catch (err) {
    console.error("❌ SQL Update Error:", err);
    res.status(500).json({ error: err.message });
  }
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
// const PORT = 7001;
// app.listen(PORT, () => {
//     console.log(`Server running at http://103.125.155.133:${PORT}`);
// });


