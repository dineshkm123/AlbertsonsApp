const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Database Connection
const db = mysql.createConnection({
    host: "mysql-dinesh-23.alwaysdata.net",
    user: "dinesh-23_albert",
    password: "albertson@23",
    database: "dinesh-23_albertsonapp",
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to MySQL database");
    }
});

// Multer Storage for Image Uploads
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });
let slnum = null;
// 📌 Route: Fetch Latest Device Info with Location & Image
// app.get("/api/get-device-info",  (req, res) => {
//     console.log("Fetching device info...");
//     console.log("slnums from get function", slnum);


//     try {
//         const [rows] =  db.query("SELECT * FROM DeviceInfo WHERE serialNumber = ?", [slnum]); // ✅ Await the query
//         console.log("query data row", [rows]);

//         if (rows.length === 0) {
//             return res.status(404).json({ message: "Device not found" });
//         }
//         res.json(rows[0]); // Return first row
//     } catch (error) {
//         console.error("Error fetching device info:", error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });
app.get("/api/get-device-info", (req, res) => {
    console.log("Fetching device info...");
    console.log("slnums from get function:", slnum);

    if (!slnum) {
        return res.status(400).json({ message: "Serial number not set yet" });
    }

    // Use callback-based query execution
    db.query("SELECT * FROM DeviceInfo WHERE serialNumber = ?", [slnum], (err, rows) => {
        if (err) {
            console.error("Error fetching device info:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        console.log("Query result:", rows);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Device not found" });
        }

        res.json(rows[0]); // Return first row
    });
});


app.post("/api/insert-device-info", (req, res) => {
    const { serialNumber, firmwareVersion, macAddress, hardwareKey, displayName, project } = req.body;

    const deviceQuery = `
        INSERT INTO DeviceInfo 
        (serialNumber, firmwareVersion, macAddress, hardwareKey, displayName, project)
        VALUES (?, ?, ?, ?, ?, ?)`;

    const deviceValues = [serialNumber, firmwareVersion, macAddress, hardwareKey, displayName, project];
    slnum = serialNumber;
    console.log("slnums only", slnum);

    console.log("deviceValues while posting barthide andre db ge insert agthide", deviceValues[0]);

    db.query(deviceQuery, deviceValues, (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Failed to insert device data" });
        }
        res.json({ message: "inserted successfully!", serialNumber });
    })
});
app.post("/api/upload", upload.single("image"), (req, res) => {
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const deviceId = result.insertId;

    // Insert location & image data in DeviceLocationImages
    const locationQuery = `
        INSERT INTO DeviceLocationImages 
        (device_id, latitude, longitude, imagePath) 
        VALUES (?, ?, ?, ?)`;

    const locationValues = [deviceId, latitude, longitude, imagePath];

    db.query(locationQuery, locationValues, (err) => {
        if (err) {
            return res.status(500).json({ error: "Failed to insert location & image data" });
        }
        res.json({ message: "Reported successfully!", device_id: deviceId });
    });
});



//// LOGIN 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


app.post("/user/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Fetch user by username
    const [user] = await pool.query("SELECT * FROM Users WHERE username=?", [
      username,
    ]);

    if (user.length === 0) {
      return res.status(404).json({ error: "User does not exist" });
    }

    // Check if the password is correct
    if (!bcrypt.compareSync(password, user[0].password)) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Generate JWT token for authenticated user
    const token = jwt.sign(
      { id: user[0].id, username },
      process.env.JWT_PRIVATEKEY
    );

    return res
      .status(200)
      .cookie("auth", token, { httpOnly: true })
      .json({ token });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// echo "# asdf" >> README.md
// git init
// git add README.md
// git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/dineshkm123/asdf.git
// git push -u origin main