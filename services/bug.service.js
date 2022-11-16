
const fs = require('fs')
const gBugs = require('../data/bug.json')

module.exports = {
    query,
    getById,
    remove,
    save
}

function query(filterBy) {
    console.log("back end query: " + filterBy)
    const title = filterBy.title || ''
    const page = +filterBy.page || 0
    const itemsPerPage = +filterBy.itemsPerPage || 3

    const regex = new RegExp(title, 'i')
    let filteredBugs = gBugs.filter(bug => regex.test(bug.title))
    const startIdx = page * itemsPerPage
    const totalPages = Math.ceil(filteredBugs.length / itemsPerPage)
    if (itemsPerPage !== Infinity) filteredBugs = filteredBugs.slice(startIdx, startIdx + itemsPerPage)
    console.log("filteredBugs")
    console.log(filteredBugs)
    return Promise.resolve({
        totalPages,
        bugs: filteredBugs
    })
}

function getById(bugId) {
    const bug = gBugs.find((bug) => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const idx = gBugs.findIndex((bug) => bug._id === bugId)
    gBugs.splice(idx, 1)
    return _saveBugsToFile()
}

function save(bug) {
    console.log("save bug back-end")
    console.log(bug)
    if (bug._id) {
        const idx = gBugs.findIndex((currBug) => currBug._id === bug._id)
        gBugs[idx] = bug
    } else {
        bug._id = _makeId()
        gBugs.unshift(bug)
    }
    return _saveBugsToFile().then(() => bug)
}

function _makeId(length = 5) {
    var txt = ''
    var possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}
function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(gBugs, null, 2)

        fs.writeFile('data/bug.json', data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}
