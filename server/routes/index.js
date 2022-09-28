const express = require('express')
const router = express.Router()

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

router.get('/about.json', (req, res) => {
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

module.exports = router