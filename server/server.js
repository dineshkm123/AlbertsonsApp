const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
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
cloudinary.config({
    cloud_name: "dtydck0qe",
    api_key: "958966191174921",
    api_secret: "0T-SR-dMU-myVs6EuUJV8vcXQxU"
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "device_reports",
        allowed_formats: ["jpg", "png", "jpeg"],
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
    console.log("REQ BODY IN INSERT DEVICE INFO ", req.body);
    slnum = serialNumber;

    if (!serialNumber || !firmwareVersion || !macAddress || !hardwareKey || !displayName) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const deviceQuery = `
        INSERT INTO DeviceInfo 
        (serialNumber, firmwareVersion, macAddress, hardwareKey, displayName, project)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
        firmwareVersion = VALUES(firmwareVersion),
        hardwareKey = VALUES(hardwareKey),
        displayName = VALUES(displayName),
        project = VALUES(project)
    `;

    const deviceValues = [serialNumber, firmwareVersion, macAddress, hardwareKey, displayName, project];

    db.query(deviceQuery, deviceValues, (err, result) => {
        if (err) {
            console.error("Database Insert Error:", err.sqlMessage);
            return res.status(500).json({ error: "Database error", details: err.sqlMessage });
        }

        res.json({
            message: "Device inserted/updated successfully!",
            device_id: result.insertId || serialNumber
        });
    });
});

app.post("/api/submit-report", upload.single("image"), async (req, res) => {
    const { serialNumber, latitude, longitude } = req.body;
    console.log("submit-report body", req.body);

    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Get the device ID based on the serialNumber
    const deviceQuery = "SELECT id FROM DeviceInfo WHERE serialNumber = ?";
    db.query(deviceQuery, [slnum], async (err, results) => {
        if (err) {
            console.error("Error fetching device:", err);
            return res.status(500).json({ error: "Database error" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Device not found" });
        }

        const deviceId = results[0].id;
        let imageUrl = null;

        // Upload image to Cloudinary
        if (req.file) {
            try {
                imageUrl = req.file.path; // Cloudinary automatically returns a hosted URL
            } catch (uploadError) {
                console.error("Cloudinary upload error:", uploadError);
                return res.status(500).json({ error: "Image upload failed" });
            }
        }

        // Insert into reports table
        const reportQuery = `
            INSERT INTO reports (device_id, image, latitude, longitude) 
            VALUES (?, ?, ?, ?)`;
        const reportValues = [deviceId, imageUrl, latitude, longitude];

        db.query(reportQuery, reportValues, (err, result) => {
            if (err) {
                console.error("Insert error:", err);
                return res.status(500).json({ error: "Failed to insert report" });
            }
            res.json({ message: "Report submitted successfully!", report_id: result.insertId });
        });
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