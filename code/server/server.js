const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcrypt');

app.use(cors());
// อนุญาติให้ใครยิงมาก็ได้
app.use(bodyparser.json());

const port = 8000

let conn = null

const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'smart_farm'
    })
}

// path = POST /users สำหรับการสร้าง users ใหม่ที่บันทึกเข้ามา โดยใช้ bcrypt ในการเข้ารหัส password
app.post('/users/register' , async (req, res) => {
    try {
        const { Username, Password, Email } = req.body
        const passwordHash = await bcrypt.hash(Password, 10)
        const userData = {
            Username,
            Password: passwordHash,
            Email
        }
        const results = await conn.query('INSERT INTO users SET ?', userData)
        res.json({
            message: 'insert ok',
            data: results[0]
        })
    } catch (error) {
        res.status(500).json({
            message: 'something wrong',
            errorMessage: error.message
        })
    }
})

// path = POST /users/login สำหรับการ login โดยต้องเช็คว่า username และ password ตรงกับที่มีในระบบหรือไม่
app.post('/users/login', async (req, res) => {
    try {
        const { Username, Password} = req.body
        const [results] = await conn.query('SELECT * FROM users WHERE Username = ?', Username)

        if (results.length === 0) {
            return res.status(400).json({
                message: 'ล็อกอินไม่สำเร็จ: ไม่พบชื่อผู้ใช้'
            });
        }

        const userData = results[0]
        const match = await bcrypt.compare(Password, userData.Password)
        if (!match) {
            return res.status(400).json({ 
                message: 'ล็อกอินไม่สำเร็จ: รหัสผ่านไม่ถูกต้อง' 
            });
        }
        return res.json({ 
            username: userData.Username,
            message: 'ล็อกอินสำเร็จ',
            role: userData.UserRole
        });        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'เกิดข้อผิดพลาดบางอย่าง'
        });
    }
})

// path = GET /plant/name สำหรับ query ชื่อพืชทั้งหมดที่มีในระบบ
app.get('/plant/name', async (req, res) => {
    const results = await conn.query(`
        SELECT * FROM plant
        `)
    res.json(results[0])
})
// path = GET /plant/name/:id สำหรับการดึง ชื่อพืช ตาม id ที่ต้องการ
app.get('/plant/name/:id', async (req, res) => {
    try {
        let id = req.params.id
        const results = await conn.query('SELECT * FROM plant WHERE Plant_ID = ?', id)

        if (results[0].length == 0) {
            //โยนทิ้ง
            throw { statusCode: 404, message: 'not found!!' }
            
        } 
        res.json(results[0][0])

    } catch (error) {
        let statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: 'something wrong',
            errorMessage: error.message
        })
    }
})
// path = POST /plant/name สำหรับการสร้าง ชื่อพืช ใหม่ที่บันทึกเข้ามา
app.post('/plant/name' , async (req, res) => {
    try {
        let plant = req.body
        const results = await conn.query('INSERT INTO plant SET ?', plant)
        res.json({
            message: 'insert ok',
            data: results[0]
        })
    } catch (error) {
        res.status(500).json({
            message: 'something wrong',
            errorMessage: error.message
        })
    }
})
// path = DELETE /plant/name/:id สำหรับการลบ ชื่อพืช ที่ต้องการออกจากระบบ
app.delete('/plant/name/:id', async (req, res) => {
    try {
        let id = req.params.id
        await conn.query('DELETE FROM planting_record WHERE Plant_ID = ?', id)
        const results = await conn.query('DELETE FROM plant WHERE Plant_ID = ?', id)
        res.json({
            message: 'delete ok',
            data: results[0]
        })
    } catch (error) {
        res.status(500).json({
            message: 'something wrong',
            errorMessage: error.message
        })
    }
})
// path = PUT /plant/name/:id สำหรับการแก้ไข ชื่อพืช ที่ต้องการออกจากระบบ
app.put('/plant/name/:id', async (req,res) => {
    try {
        let id = req.params.id
        let updateplant = req.body
        const [results] = await conn.query('UPDATE plant SET ? WHERE Plant_ID = ?', [updateplant, id])
        res.json({
            message: 'update ok',
            data: results[0]
        })
    } catch (error) {
        res.status(500).json({
            message: 'something wrong',
            errorMessage: error.message
        })
    }
})

// path = GET /plant/season สำหรับ query ฤดูกาลของพืชทั้งหมดที่มีในระบบ
app.get('/plant/season', async (req, res) => {
    const results = await conn.query(`
        SELECT * FROM plant_season
        `)
    res.json(results[0])
})
// path = GET /plant/season/:id สำหรับการดึง ฤดูกาล ตาม id ที่ต้องการ
app.get('/plant/season/:id', async (req, res) => {
    try {
        let id = req.params.id
        const results = await conn.query('SELECT * FROM plant_season WHERE Plant_season_ID = ?', id)

        if (results[0].length == 0) {
            //โยนทิ้ง
            throw { statusCode: 404, message: 'not found!!' }
            
        } 
        res.json(results[0][0])

    } catch (error) {
        let statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: 'something wrong',
            errorMessage: error.message
        })
    }
})
// path = POST /plant/season สำหรับการสร้าง ฤดูกาล ใหม่ที่บันทึกเข้ามา
app.post('/plant/season' , async (req, res) => {
    try {
        let plant = req.body
        const results = await conn.query('INSERT INTO plant_season SET ?', plant)
        res.json({
            message: 'insert ok',
            data: results[0]
        })
    } catch (error) {
        res.status(500).json({
            message: 'something wrong',
            errorMessage: error.message
        })
    }
})
// path = DELETE /plant/season/:id สำหรับการลบ season ตาม id
app.delete('/plant/season/:id', async (req, res) => {
    try {
        let id = req.params.id
        await conn.query('DELETE FROM planting_record WHERE Plant_season_ID = ?', id)
        const results = await conn.query('DELETE FROM plant_season WHERE Plant_season_ID = ?', id)
        res.json({
            message: 'delete ok',
            data: results[0]
        })
    } catch (error) {
        res.status(500).json({
            message: 'something wrong',
            errorMessage: error.message
        })
    }
})
// path = PUT /plant/season/:id สำหรับการแก้ไข ฤดูกาล ที่ต้องการออกจากระบบ
app.put('/plant/season/:id', async (req,res) => {
    try {
        let id = req.params.id
        let updateplant = req.body
        const [results] = await conn.query('UPDATE plant_season SET ? WHERE Plant_season_ID = ?', [updateplant, id])
        res.json({
            message: 'update ok',
            data: results[0]
        })
    } catch (error) {
        res.status(500).json({
            message: 'something wrong',
            errorMessage: error.message
        })
    }
})

// path = GET /plant/area สำหรับ query พื้นที่ปลูกของพืชทั้งหมดที่มีในระบบ
app.get('/plant/area', async (req, res) => {
    const results = await conn.query(`
        SELECT * FROM plantation_area
        `)
    res.json(results[0])
})
// path = GET /plant/area/:id สำหรับการดึง พื้นที่ปลูก ตาม id ที่ต้องการ
app.get('/plant/area/:id', async (req, res) => {
    try {
        let id = req.params.id
        const results = await conn.query('SELECT * FROM plantation_area WHERE Plantation_area_ID = ?', id)

        if (results[0].length == 0) {
            //โยนทิ้ง
            throw { statusCode: 404, message: 'not found!!' }
            
        } 
        res.json(results[0][0])

    } catch (error) {
        let statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: 'something wrong',
            errorMessage: error.message
        })
    }
})
// path = POST /plant/area สำหรับการสร้าง พื้นที่ปลูก ใหม่ที่บันทึกเข้ามา
app.post('/plant/area' , async (req, res) => {
    try {
        let plant = req.body
        const results = await conn.query('INSERT INTO plantation_area SET ?', plant)
        res.json({
            message: 'insert ok',
            data: results[0]
        })
    } catch (error) {
        res.status(500).json({
            message: 'something wrong',
            errorMessage: error.message
        })
    }
})
// path = DELETE /plant/area/:id สำหรับการลบ พื้นที่ปลูก ที่ต้องการออกจากระบบ
app.delete('/plant/area/:id', async (req, res) => {
    try {
        let id = req.params.id
        await conn.query('DELETE FROM planting_record WHERE Plantation_area_ID = ?', id)
        const results = await conn.query('DELETE FROM plantation_area WHERE Plantation_area_ID = ?', id)
        res.json({
            message: 'delete ok',
            data: results[0]
        })
    } catch (error) {
        res.status(500).json({
            message: 'something wrong',
            errorMessage: error.message
        })
    }
})
// path = PUT /plant/area/:id สำหรับการแก้ไข พื้นที่ปลูก ที่ต้องการออกจากระบบ
app.put('/plant/area/:id', async (req,res) => {
    try {
        let id = req.params.id
        let updateplant = req.body
        const [results] = await conn.query('UPDATE plantation_area SET ? WHERE Plantation_area_ID = ?', [updateplant, id])
        res.json({
            message: 'update ok',
            data: results[0]
        })
    } catch (error) {
        res.status(500).json({
            message: 'something wrong',
            errorMessage: error.message
        })
    }
})

// path = GET /plant/growth_stage สำหรับ query ช่วงเวลาการเจริญเติบของพืชทั้งหมดที่มีในระบบ
app.get('/plant/growth_stage', async (req, res) => {
    const results = await conn.query(`
        SELECT * FROM growth_stage
        `)
    res.json(results[0])
})
// path = GET /plant/area/:id สำหรับการดึง ช่วงเวลาการเจริญเติบ ตาม id ที่ต้องการ
app.get('/plant/growth_stage/:id', async (req, res) => {
    try {
        let id = req.params.id
        const results = await conn.query('SELECT * FROM growth_stage WHERE Growth_stage_ID = ?', id)

        if (results[0].length == 0) {
            //โยนทิ้ง
            throw { statusCode: 404, message: 'not found!!' }
            
        } 
        res.json(results[0][0])

    } catch (error) {
        let statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: 'something wrong',
            errorMessage: error.message
        })
    }
})
// path = POST /plant/growth_stage สำหรับการสร้าง ช่วงเวลาการเจริญเติบ ใหม่ที่บันทึกเข้ามา
app.post('/plant/growth_stage' , async (req, res) => {
    try {
        let plant = req.body
        const results = await conn.query('INSERT INTO growth_stage SET ?', plant)
        res.json({
            message: 'insert ok',
            data: results[0]
        })
    } catch (error) {
        res.status(500).json({
            message: 'something wrong',
            errorMessage: error.message
        })
    }
})
// path = DELETE /plant/growth_stage/:id สำหรับการลบ ช่วงเวลาการเจริญเติบ ที่ต้องการออกจากระบบ
app.delete('/plant/growth_stage/:id', async (req, res) => {
    try {
        let id = req.params.id
        await conn.query('DELETE FROM planting_record WHERE Growth_stage_ID = ?', id)
        const results = await conn.query('DELETE FROM growth_stage WHERE Growth_stage_ID = ?', id)
        res.json({
            message: 'delete ok',
            data: results[0]
        })
    } catch (error) {
        res.status(500).json({
            message: 'something wrong',
            errorMessage: error.message
        })
    }
})
// path = PUT /plant/growth_stage/:id สำหรับการแก้ไข ช่วงเวลาการเจริญเติบ ที่ต้องการออกจากระบบ
app.put('/plant/growth_stage/:id', async (req,res) => {
    try {
        let id = req.params.id
        let updateplant = req.body
        const [results] = await conn.query('UPDATE growth_stage SET ? WHERE Growth_stage_ID = ?', [updateplant, id])
        res.json({
            message: 'update ok',
            data: results[0]
        })
    } catch (error) {
        res.status(500).json({
            message: 'something wrong',
            errorMessage: error.message
        })
    }
})

// path = GET /plant/all สำหรับ query ของพืชทั้งหมดที่มีในระบบ
app.get('/plant/all', async (req, res) => {
    const [results] = await conn.query(`
        SELECT  pr.ID1,
                pr.Timestamp,
                plant.Plant_Name, 
                plant_season.Season, 
                plantation_area.Area, 
                pr.Crop_density, 
                growth_stage.Growth,
                pr.Fertilizer_usage, 
                pr.Pest_pressure
            FROM planting_record AS pr
            JOIN plant ON pr.Plant_ID = plant.Plant_ID
            JOIN plant_season ON pr.Plant_season_ID = plant_season.Plant_season_ID
            JOIN plantation_area ON pr.Plantation_area_ID = plantation_area.Plantation_area_ID
            JOIN growth_stage ON pr.Growth_stage_ID = growth_stage.Growth_stage_ID
            ORDER BY pr.Timestamp
        `)
        // แปลงค่า Timestamp เป็นโซนเวลาไทย (GMT+7)
        const formattedResults = results.map(row => ({
            ID: row.ID1,
            Timestamp: row.Timestamp
                ? new Date(row.Timestamp).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })
                : "Invalid Timestamp",
            Plant_Name: row.Plant_Name,
            Season: row.Season,
            Area: row.Area,
            Crop_density: row.Crop_density,
            Growth: row.Growth,
            Fertilizer_usage: row.Fertilizer_usage,
            Pest_pressure: row.Pest_pressure
        }))
    res.json(formattedResults)
})
// path = POST /plant/all สำหรับการสร้าง plants ใหม่ที่บันทึกเข้ามา
app.post('/plant/all' , async (req, res) => {
    try {
        let plants = req.body
        // INSERT ข้อมูล
        const [results] = await conn.query(
            `INSERT INTO planting_record 
            (Timestamp, Plant_ID, Plant_season_ID, Plantation_area_ID, Crop_density, 
            Growth_stage_ID, Fertilizer_usage, Pest_pressure) 
            VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?)`,
            [
                plants.Plant_ID,
                plants.Plant_season_ID,
                plants.Plantation_area_ID,
                plants.Crop_density,
                plants.Growth_stage_ID,
                plants.Fertilizer_usage,
                plants.Pest_pressure
            ]
        )
        res.json({
            message: 'insert ok',
            data: results[0]
        })
    } catch (error) {
        res.status(500).json({
            message: 'something wrong',
            errorMessage: error.message
        })
    }
})

// path = GET /plant/all/:id สำหรับการดึง users หลายคนออกมา
app.get('/plant/all/:id', async (req, res) => {
    try {
        let id = req.params.id
        const results = await conn.query('SELECT * FROM planting_record WHERE ID1 = ?', id)

        if (results[0].length == 0) {
            //โยนทิ้ง
            throw { statusCode: 404, message: 'not found!!' }
            
        } 
        res.json(results[0][0])

    } catch (error) {
        let statusCode = error.statusCode || 500
        res.status(statusCode).json({
            message: 'something wrong',
            errorMessage: error.message
        })
    }
})
// path = PUT /plant/all/:id สำหรับการแก้ไข 
app.put('/plant/all/:id', async (req,res) => {
    try {
        let id = req.params.id
        let updateplant = req.body
        const [results] = await conn.query('UPDATE planting_record SET ? WHERE ID1 = ?', [updateplant, id])
        res.json({
            message: 'update ok',
            data: results[0]
        })
    } catch (error) {
        res.status(500).json({
            message: 'something wrong',
            errorMessage: error.message
        })
    }
})
// path = DELETE /plant/all/:id สำหรับการลบ ช่วงเวลาการเจริญเติบ ที่ต้องการออกจากระบบ
app.delete('/plant/all/:id', async (req, res) => {
    try {
        let id = req.params.id
        const results = await conn.query('DELETE FROM planting_record WHERE ID1 = ?', id)
        res.json({
            message: 'delete ok',
            data: results[0]
        })
    } catch (error) {
        res.status(500).json({
            message: 'something wrong',
            errorMessage: error.message
        })
    }
})

app.listen(port, async (req, res) => {
    await initMySQL()
    console.log('http server run at ' + port)
})