const axios = require('axios');
const moment = require("moment")

const from = 3
const to = 31
const districts = [ 145 /* East Delhi */, 650 /* Gautam Budhh Nagar */, 670 /* Lucknow */ ]
const ageLimit = 18

async function main() {
    const when = moment().format()
    console.log(`${when.slice(0, when.length - 9)}: Checking slots from ${from} to ${to} May in districts ${districts} for age = ${ageLimit}`)
    const tasks = []
    let slots = 0
    try {
        for (let i = from; i <= to; i++) {
            for (let j = 0; j < districts.length; j++) {
                tasks.push(axios.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${districts[j]}&date=${i}-05-2021`))
            }
        }
        const res = await Promise.all(tasks)
        let info = []

        for (let i = 0; i < res.length; i++) {
            info = info.concat(res[i].data.sessions)
        }

        for (let i = 0; i < info.length; i++) {
            const { available_capacity, min_age_limit, name, date, pincode, vaccine, district_name } = info[i]
            if (min_age_limit == ageLimit && available_capacity > 0) {
                slots += available_capacity
                console.log({ available_capacity, min_age_limit, name, date, pincode, vaccine, district_name })
            }
        }
        console.log(slots, 'slots available\n')
    } catch (error) {
        console.error(error);
    }
}

main()
