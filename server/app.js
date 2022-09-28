const express = require('express')
const app = express()
const port = 8080

app.get('/', (req, res) => {
    res.send('Hello World!')
})

function getServices() {
    // fetch DB return available services
    // {
    //     "name": "Facebook",
    //     "actions": [{
    //       "name": "action_1",
    //       "description": "action_dsc_1"
    //     }],
    //     "reactions": [{
    //       "name": "reaction_1",
    //       "description": "reaction_dsc_1"
    //     }]
    // }
    return []
}

app.get('/about.json', (req, res) => {
    const ip = req.ip.split(':')[3]
    console.log(ip)
    res.json({
        "client": {
            "host": ip
        },
        "server": {
            "current_time": Date.now()
        },
        "services": getServices()
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})