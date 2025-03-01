const BASE_URL = 'http://localhost:8000'

window.onload = async () => {
    await loadData()
    await dropdown()
}

let ID_name = null
let ID_season = null
let ID_area = null
let ID_growth = null
let ID_all = null

function openModal(num) {
    const modalIDs = [
        "modal", "editmodal", "season", "editseason",
        "area", "editarea", "growth", "editgrowth", "addall", "edit"
    ];
    if (modalIDs[num - 1]) {
            document.getElementById(modalIDs[num - 1]).style.display = "flex";
            if (num == 9) {
                dropdown()
            }
    } else {
        console.log('error');
    }
}
function closeModal(num) {
    const modalIDs = [
        "modal", "editmodal", "season", "editseason",
        "area", "editarea", "growth", "editgrowth", "addall", "edit"
    ];
    if (modalIDs[num - 1]) {
        document.getElementById(modalIDs[num - 1]).style.display = "none";
    } else {
        console.log('error');
    }
}

const loadData = async () => {
    const response1 = await axios.get(`${BASE_URL}/plant/name`)
    const response2 = await axios.get(`${BASE_URL}/plant/season`)
    const response3 = await axios.get(`${BASE_URL}/plant/area`)
    const response4 = await axios.get(`${BASE_URL}/plant/growth_stage`)

    const plantsDOM1 = document.querySelector("#plantTable1 tbody")
    const plantsDOM2 = document.querySelector("#plantTable2 tbody")
    const plantsDOM3 = document.querySelector("#plantTable3 tbody")
    const plantsDOM4 = document.querySelector("#plantTable4 tbody")
    
    let htmlData1 = ''
    let htmlData2 = ''
    let htmlData3 = ''
    let htmlData4 = ''

    for (let i=0;i<response1.data.length;i++) {
        let plant = response1.data[i]
        htmlData1 += `<tr>
            <td>${plant.Plant_Name}</td>
            <td>
                <button class='edittname' data-id=${plant.Plant_ID}>Edit</button>
                <button class='deletename' data-id=${plant.Plant_ID}>Delete</button>
            </td>   
        </tr>`
    }
    for (let i=0;i<response2.data.length;i++) {
        let plant = response2.data[i]
        htmlData2 += `<tr>
            <td>${plant.Season}</td>
            <td>
                <button class='edittseason' data-id=${plant.Plant_season_ID}>Edit</button>
                <button class='deleteseason' data-id=${plant.Plant_season_ID}>Delete</button>
            </td>   
        </tr>`
    }
    for (let i=0;i<response3.data.length;i++) {
        let plant = response3.data[i]
        htmlData3 += `<tr>
            <td>${plant.Area}</td>
            <td>
                <button class='edittarea' data-id=${plant.Plantation_area_ID}>Edit</button>
                <button class='deletearea' data-id=${plant.Plantation_area_ID}>Delete</button>
            </td>   
        </tr>`
    }
    for (let i=0;i<response4.data.length;i++) {
        let plant = response4.data[i]
        htmlData4 += `<tr>
            <td>${plant.Growth}</td>
            <td>
                <button class='edittgrowth' data-id=${plant.Growth_stage_ID}>Edit</button>
                <button class='deletegrowth' data-id=${plant.Growth_stage_ID}>Delete</button>
            </td>   
        </tr>`
    }
    
    plantsDOM1.innerHTML = htmlData1
    plantsDOM2.innerHTML = htmlData2
    plantsDOM3.innerHTML = htmlData3
    plantsDOM4.innerHTML = htmlData4

    // button class=dalete
    const deleteName = document.getElementsByClassName('deletename')
    const deleteSeason = document.getElementsByClassName('deleteseason')
    const deleteArea = document.getElementsByClassName('deletearea')
    const deleteGrowth = document.getElementsByClassName('deletegrowth')

    for (let i=0;i<deleteName.length;i++) {
        deleteName[i].addEventListener('click', async (event) => {
            // ดึง id ออกมา
            const id = event.target.dataset.id
            deletePlant(id, "name")
        })
    }
    for (let i=0;i<deleteSeason.length;i++) {
        deleteSeason[i].addEventListener('click', async (event) => {
            const id = event.target.dataset.id
            deletePlant(id, "season")
        })
    }
    for (let i=0;i<deleteArea.length;i++) {
        deleteArea[i].addEventListener('click', async (event) => {
            const id = event.target.dataset.id
            deletePlant(id, "area")
        })
    }
    for (let i=0;i<deleteGrowth.length;i++) {
        deleteGrowth[i].addEventListener('click', async (event) => {
            const id = event.target.dataset.id
            deletePlant(id, "growth")
        })
    }


    // button class=edit
    const editName = document.getElementsByClassName('edittname')
    const editSeason = document.getElementsByClassName('edittseason')
    const editArea = document.getElementsByClassName('edittarea')
    const editGrowth = document.getElementsByClassName('edittgrowth')

    for (let i=0;i<editName.length;i++) {
        editName[i].addEventListener('click', async (event) => {
            ID_name = event.target.dataset.id
            try {
                const response = await axios.get(`${BASE_URL}/plant/name/${ID_name}`)
                const plant = response.data
                openModal(2)
                let plantName = document.getElementById('epname')
                plantName.value = plant.Plant_Name
            } catch (error) {
                console.log('error', error)
            }
        })
    }
    for (let i=0;i<editSeason.length;i++) {
        editSeason[i].addEventListener('click', async (event) => {
            ID_season = event.target.dataset.id
            try {
                const response = await axios.get(`${BASE_URL}/plant/season/${ID_season}`)
                const plant = response.data
                openModal(4)
                let season = document.getElementById('epseason')
                season.value = plant.Season
            } catch (error) {
                console.log('error', error)
            }
        })
    }
    for (let i=0;i<editArea.length;i++) {
        editArea[i].addEventListener('click', async (event) => {
            ID_area = event.target.dataset.id
            try {
                const response = await axios.get(`${BASE_URL}/plant/area/${ID_area}`)
                const plant = response.data
                openModal(6)
                let area = document.getElementById('eparea')
                area.value = plant.Area
            } catch (error) {
                console.log('error', error)
            }
        })
    }
    for (let i=0;i<editGrowth.length;i++) {
        editGrowth[i].addEventListener('click', async (event) => {
            ID_growth = event.target.dataset.id
            try {
                const response = await axios.get(`${BASE_URL}/plant/growth_stage/${ID_growth}`)
                const plant = response.data
                openModal(8)
                let growth = document.getElementById('epgrowth')
                growth.value = plant.Growth
            } catch (error) {
                console.log('error', error)
            }
        })
    }

    const showall = await axios.get(`${BASE_URL}/plant/all`)
    const allDOM = document.querySelector("#plantTable tbody")
    let htmlDatanaja = ''
    for (let i=0;i<showall.data.length;i++) {
        let plant = showall.data[i]
        htmlDatanaja += `<tr>
            <td>${i+1}</td>
            <td>${plant.Timestamp}</td>
            <td>${plant.Plant_Name}</td>
            <td>${plant.Season}</td>
            <td>${plant.Area}</td>
            <td>${plant.Crop_density}</td>
            <td>${plant.Growth}</td>
            <td>${plant.Fertilizer_usage}</td>
            <td>${plant.Pest_pressure}</td>
            <td>
                <button class='edittall' data-id=${plant.ID}>Edit</button>
                <button class='deleteall' data-id=${plant.ID}>Delete</button>
            </td>   
        </tr>`
    }
    allDOM.innerHTML = htmlDatanaja

    // button class=edit
    const edittall = document.getElementsByClassName('edittall')

    for (let i=0;i<edittall.length;i++) {
        edittall[i].addEventListener('click', async (event) => {
            ID_all = event.target.dataset.id
            try {
                const response = await axios.get(`${BASE_URL}/plant/all/${ID_all}`)
                const plant = response.data
                openModal(10)
                document.getElementById('plantName2').value = plant.Plant_ID
                document.getElementById('plantseason2').value = plant.Plant_season_ID
                document.getElementById('plantarea2').value = plant.Plantation_area_ID
                document.getElementById('growthstage2').value = plant.Growth_stage_ID
                document.getElementById('cropdensity2').value = plant.Crop_density
                document.getElementById('pestFertilizer2').value = plant.Fertilizer_usage
                document.getElementById('pestpressure2').value = plant.Pest_pressure
            } catch (error) {
                console.log('error', error)
            }
        })
    }
    // delete
    const deleteall = document.getElementsByClassName('deleteall')

    for (let i=0;i<deleteall.length;i++) {
        deleteall[i].addEventListener('click', async (event) => {
            // ดึง id ออกมา
            const id = event.target.dataset.id
            deletePlant(id, "all")
        })
    }
}
document.getElementById('editplantForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // ป้องกันการรีเฟรชหน้า

    let name = document.getElementById("plantName2").value
    let season = document.getElementById("plantseason2").value
    let area = document.getElementById("plantarea2").value
    let growth = document.getElementById("growthstage2").value
    let crop = document.getElementById("cropdensity2").value
    let ferr = document.getElementById("pestFertilizer2").value
    let pre = document.getElementById("pestpressure2") .value

    try {

        let plantData = {
            "Plant_ID": name,
            "Plant_season_ID": season,
            "Plantation_area_ID": area,
            "Crop_density": crop,
            "Growth_stage_ID": growth,
            "Fertilizer_usage": ferr,
            "Pest_pressure": pre
        }

        const errors = validateDate(plantData,20)

        if (errors.length > 0) {
            // มี error เกิดขึ้น
            throw {
                message: 'กรอกข้อมูลไม่ครบ',
                errors: errors
            }
        }
    
        const response = await axios.put(`${BASE_URL}/plant/all/${ID_all}`, plantData);
        console.log('Response:', response.data);
        alert('แก้ไขข้อมูลเรียบร้อย');
        loadData()
    } catch (error) {

        let htmlData = error.message
        htmlData += 'กรุณากรอก '
        for(let i=0;i<error.errors.length;i++) {
            htmlData += error.errors[i]

            if (i < error.errors.length-1) {
                htmlData += ','
            }
        }

        console.log('Error Message', error.message)
        console.error('Error:', error.errors);
        alert(htmlData);
    }
})

document.getElementById('enameForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // ป้องกันการรีเฟรชหน้า

    let plant = document.getElementById('epname').value

    try {

        let plantData = {
            "Plant_Name": plant
        }

        const errors = validateDate(plantData,1)

        if (errors.length > 0) {
            // มี error เกิดขึ้น
            throw {
                message: 'กรอกข้อมูลไม่ครบ',
                errors: errors
            }
        }
    
        const response = await axios.put(`${BASE_URL}/plant/name/${ID_name}`, plantData);
        console.log('Response:', response.data);
        alert('แก้ไขข้อมูลเรียบร้อย');
        loadData()
    } catch (error) {

        let htmlData = error.message
        htmlData += 'กรุณากรอก '
        for(let i=0;i<error.errors.length;i++) {
            htmlData += error.errors[i]

            if (i < error.errors.length-1) {
                htmlData += ','
            }
        }

        console.log('Error Message', error.message)
        console.error('Error:', error.errors);
        alert(htmlData);
    }
})
document.getElementById('eseasonForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // ป้องกันการรีเฟรชหน้า

    let plant = document.getElementById('epseason').value

    try {

        let plantData = {
            "Season": plant
        }

        const errors = validateDate(plantData,2)

        if (errors.length > 0) {
            // มี error เกิดขึ้น
            throw {
                message: 'กรอกข้อมูลไม่ครบ',
                errors: errors
            }
        }
    
        const response = await axios.put(`${BASE_URL}/plant/season/${ID_season}`, plantData);
        console.log('Response:', response.data);
        alert('แก้ไขข้อมูลเรียบร้อย');
        loadData()
    } catch (error) {

        let htmlData = error.message
        htmlData += 'กรุณากรอก '
        for(let i=0;i<error.errors.length;i++) {
            htmlData += error.errors[i]

            if (i < error.errors.length-1) {
                htmlData += ','
            }
        }

        console.log('Error Message', error.message)
        console.error('Error:', error.errors);
        alert(htmlData);
    }
})
document.getElementById('eareaForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // ป้องกันการรีเฟรชหน้า

    let plant = document.getElementById('eparea').value

    try {

        let plantData = {
            "Area": plant
        }

        const errors = validateDate(plantData,3)

        if (errors.length > 0) {
            // มี error เกิดขึ้น
            throw {
                message: 'กรอกข้อมูลไม่ครบ',
                errors: errors
            }
        }
    
        const response = await axios.put(`${BASE_URL}/plant/area/${ID_area}`, plantData);
        console.log('Response:', response.data);
        alert('แก้ไขข้อมูลเรียบร้อย');
        loadData()
    } catch (error) {

        let htmlData = error.message
        htmlData += 'กรุณากรอก '
        for(let i=0;i<error.errors.length;i++) {
            htmlData += error.errors[i]

            if (i < error.errors.length-1) {
                htmlData += ','
            }
        }

        console.log('Error Message', error.message)
        console.error('Error:', error.errors);
        alert(htmlData);
    }
})
document.getElementById('egrowthForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // ป้องกันการรีเฟรชหน้า

    let plant = document.getElementById('epgrowth').value

    try {

        let plantData = {
            "Growth": plant
        }

        const errors = validateDate(plantData,4)

        if (errors.length > 0) {
            // มี error เกิดขึ้น
            throw {
                message: 'กรอกข้อมูลไม่ครบ',
                errors: errors
            }
        }
    
        const response = await axios.put(`${BASE_URL}/plant/growth_stage/${ID_growth}`, plantData);
        console.log('Response:', response.data);
        alert('แก้ไขข้อมูลเรียบร้อย');
        loadData()
    } catch (error) {

        let htmlData = error.message
        htmlData += 'กรุณากรอก '
        for(let i=0;i<error.errors.length;i++) {
            htmlData += error.errors[i]

            if (i < error.errors.length-1) {
                htmlData += ','
            }
        }

        console.log('Error Message', error.message)
        console.error('Error:', error.errors);
        alert(htmlData);
    }
})

const deletePlant = async (id, type) => {
    try {
        let endpoint = "";
        switch (type) {
            case "name":
                endpoint = `/plant/name/${id}`;
                break;
            case "season":
                endpoint = `/plant/season/${id}`;
                break;
            case "area":
                endpoint = `/plant/area/${id}`;
                break;
            case "growth":
                endpoint = `/plant/growth_stage/${id}`;
                break;
            case "all":
                endpoint = `/plant/all/${id}`;
                break;
            default:
                console.error("Invalid type");
                return;
        }

        const confirmDelete = confirm("Are you sure you want to delete this item?");
        if (!confirmDelete) return;

        await axios.delete(`${BASE_URL}${endpoint}`);
        alert("Deleted successfully");
        loadData(); // โหลดข้อมูลใหม่
    } catch (error) {
        console.error("Error deleting item:", error);
        alert("Failed to delete item");
    }
}

const validateDate = (userData,num) => {
    let errors = []

    if (num == 1) {
        if (!userData.Plant_Name) {
            errors.push('PlantName')
        }
    } else if (num == 2) {
        if (!userData.Season) {
            errors.push('Season')
        }
    }  else if (num == 3) {
        if (!userData.Area) {
            errors.push('Area')
        }
    } else if (num == 4) {
        if (!userData.Growth) {
            errors.push('Growth')
        }
    }
    else {
        if (!userData.Plant_ID) {
            errors.push('PlantName')
        }
        if (!userData.Plant_season_ID) {
            errors.push('PlantSeason')
        }
        if (!userData.Plantation_area_ID) {
            errors.push('Plantarea')
        }
        if (!userData.Growth_stage_ID) {
            errors.push('GrowthStage')
        }
        if (!userData.Crop_density) {
            errors.push('CropDensity')
        }
        if (!userData.Pest_pressure) {
            errors.push('PestPressure')
        }
        if (!userData.Fertilizer_usage) {
            errors.push('FertilizerUsage')
        }
    }
    return errors
}

document.getElementById('nameForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // ป้องกันการรีเฟรชหน้า

    let plantname = document.getElementById('pname').value.trim();

    try {

        let plantData = {
            "Plant_Name": plantname
        }

        const errors = validateDate(plantData,1)

        if (errors.length > 0) {
            // มี error เกิดขึ้น
            throw {
                message: 'กรอกข้อมูลไม่ครบ',
                errors: errors
            }
        }
        await axios.post(`${BASE_URL}/plant/name`, plantData)
        alert('บันทึกข้อมูลเรียบร้อย')
        document.getElementById('nameForm').reset()
        loadData()
    } catch (error) {
        let htmlData = error.message
        htmlData += 'กรุณากรอก '
        for(let i=0;i<error.errors.length;i++) {
            htmlData += error.errors[i]

            if (i < error.errors.length-1) {
                htmlData += ','
            }
        }
        alert(htmlData)
    }
})

document.getElementById('seasonForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // ป้องกันการรีเฟรชหน้า

    let season = document.getElementById('pseason').value.trim();

    try {

        let seasonData = {
            "Season": season
        }

        const errors = validateDate(seasonData,2)

        if (errors.length > 0) {
            // มี error เกิดขึ้น
            throw {
                message: 'กรอกข้อมูลไม่ครบ',
                errors: errors
            }
        }
        await axios.post(`${BASE_URL}/plant/season`, seasonData)
        alert('บันทึกข้อมูลเรียบร้อย')
        document.getElementById('seasonForm').reset()
        loadData()
    } catch (error) {
        let htmlData = error.message
        htmlData += 'กรุณากรอก '
        for(let i=0;i<error.errors.length;i++) {
            htmlData += error.errors[i]

            if (i < error.errors.length-1) {
                htmlData += ','
            }
        }
        alert(htmlData)
    }
})

document.getElementById('areaForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // ป้องกันการรีเฟรชหน้า

    let area = document.getElementById('parea').value.trim();

    try {

        let areaData = {
            "Area": area
        }

        const errors = validateDate(areaData,3)

        if (errors.length > 0) {
            // มี error เกิดขึ้น
            throw {
                message: 'กรอกข้อมูลไม่ครบ',
                errors: errors
            }
        }
        await axios.post(`${BASE_URL}/plant/area`, areaData)
        alert('บันทึกข้อมูลเรียบร้อย')
        document.getElementById('areaForm').reset()
        loadData()
    } catch (error) {
        let htmlData = error.message
        htmlData += 'กรุณากรอก '
        for(let i=0;i<error.errors.length;i++) {
            htmlData += error.errors[i]

            if (i < error.errors.length-1) {
                htmlData += ','
            }
        }
        alert(htmlData)
    }
})

document.getElementById('growthForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // ป้องกันการรีเฟรชหน้า

    let growth = document.getElementById('pgrowth').value.trim();

    try {

        let growthData = {
            "Growth": growth
        }

        const errors = validateDate(growthData,4)

        if (errors.length > 0) {
            // มี error เกิดขึ้น
            throw {
                message: 'กรอกข้อมูลไม่ครบ',
                errors: errors
            }
        }
        await axios.post(`${BASE_URL}/plant/growth_stage`, growthData)
        alert('บันทึกข้อมูลเรียบร้อย')
        document.getElementById('growthForm').reset()
        loadData()
    } catch (error) {
        let htmlData = error.message
        htmlData += 'กรุณากรอก '
        for(let i=0;i<error.errors.length;i++) {
            htmlData += error.errors[i]

            if (i < error.errors.length-1) {
                htmlData += ','
            }
        }
        alert(htmlData)
    }
})

const dropdown =  async () => {
    
    try {
    // Load /plant/name ทั้งหมดออกมาจาก API
    const response1 = await axios.get(`${BASE_URL}/plant/name`)
    // Load /plant/season ทั้งหมดออกมาจาก API
    const response2 = await axios.get(`${BASE_URL}/plant/season`)
    // Load /plant/area ทั้งหมดออกมาจาก API
    const response3 = await axios.get(`${BASE_URL}/plant/area`)
    // Load /plant/grwoth ทั้งหมดออกมาจาก API
    const response4 = await axios.get(`${BASE_URL}/plant/growth_stage`)

    // add
    const nameDOM = document.getElementById("plantName1")
    const seasonDOM = document.getElementById("plantSeason1")
    const areaDOM = document.getElementById("plantArea1")
    const growthDOM = document.getElementById("growthStage1")
    // edit
    const nameDOM1 = document.getElementById("plantName2")
    const seasonDOM1 = document.getElementById("plantseason2")
    const areaDOM1 = document.getElementById("plantarea2")
    const growthDOM1 = document.getElementById("growthstage2")

    let htmlData1 = '<option value="">Select a Plant</option>'
    // นำ plants ที่โหลดมาใส่กลับเข้าไปใน html
    for (let i=0;i<response1.data.length;i++) {
        let plant = response1.data[i]
        htmlData1 += `<option value="${plant.Plant_ID}">${plant.Plant_Name}</option>`
    }

    let htmlData2 = '<option value="">Select a Season</option>'
    // นำ season ที่โหลดมาใส่กลับเข้าไปใน html
    for (let i=0;i<response2.data.length;i++) {
        let plant = response2.data[i]
        htmlData2 += `<option value="${plant.Plant_season_ID}">${plant.Season}</option>`
    }

    let htmlData3 = '<option value="">Select a Area</option>'
    // นำ area ที่โหลดมาใส่กลับเข้าไปใน html
    for (let i=0;i<response3.data.length;i++) {
        let plant = response3.data[i]
        htmlData3 += `<option value="${plant.Plantation_area_ID}">${plant.Area}</option>`
    }

    let htmlData4 = '<option value="">Select a Growth Stage</option>'
    // นำ growth ที่โหลดมาใส่กลับเข้าไปใน html
    for (let i=0;i<response4.data.length;i++) {
        let plant = response4.data[i]
        htmlData4 += `<option value="${plant.Growth_stage_ID}">${plant.Growth}</option>`
    }

    // add
    nameDOM.innerHTML = htmlData1
    seasonDOM.innerHTML = htmlData2
    areaDOM.innerHTML = htmlData3
    growthDOM.innerHTML = htmlData4
    // edit
    nameDOM1.innerHTML = htmlData1
    seasonDOM1.innerHTML = htmlData2
    areaDOM1.innerHTML = htmlData3
    growthDOM1.innerHTML = htmlData4
}
    catch (error) {
        console.error("Error fetching dropdown data:", error);
        alert("Failed to load dropdown data. Please try again.");
    }
}

document.getElementById('plantFormall').addEventListener('submit', async (event) => {
    event.preventDefault(); // ป้องกันการรีเฟรชหน้า

    let plantname = document.getElementById('plantName1').value;
    let plantseason = document.getElementById('plantSeason1').value;
    let plantarea = document.getElementById('plantArea1').value;
    let growthstage = document.getElementById('growthStage1').value;
    let cropDensity = document.getElementById('cropDensity1').value.trim();
    let pestPressure = document.getElementById('pestPressure1').value.trim();
    let fertilizerUsage = document.getElementById('pestFertilizer1').value.trim();


    try {

        let plantData = {
            "Plant_ID": plantname,
            "Plant_season_ID": plantseason,
            "Plantation_area_ID": plantarea,
            "Crop_density": cropDensity,
            "Growth_stage_ID": growthstage,
            "Fertilizer_usage": fertilizerUsage,
            "Pest_pressure": pestPressure
        };

        console.log('Submitting data:', plantData);

        const errors = validateDate(plantData,20)

        if (errors.length > 0) {
            // มี error เกิดขึ้น
            throw {
                message: 'กรอกข้อมูลไม่ครบ',
                errors: errors
            }
        }
    
        const response = await axios.post('http://localhost:8000/plant/all', plantData);
        console.log('Response:', response.data);
        loadData();
        alert('บันทึกข้อมูลเรียบร้อย');
        document.getElementById('plantFormall').reset();
    } catch (error) {

        let htmlData = error.message
        htmlData += 'กรุณากรอก '
        for(let i=0;i<error.errors.length;i++) {
            htmlData += error.errors[i]

            if (i < error.errors.length-1) {
                htmlData += ','
            }
        }

        console.log('Error Message', error.message)
        console.error('Error:', error.errors);
        alert(htmlData);
    }
});