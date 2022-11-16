const express = require('express')
const cookieParser = require('cookie-parser')


const bugService = require('./services/bug.service')
const userService = require('./services/user.service')

const app = express()

// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


// LIST
app.get('/api/bug', (req, res) => {
    const { byTitle, page } = req.query

    const filterBy = {
        byTitle: byTitle || '',
        page: +page || 0,
    }
    bugService.query(filterBy).then((bugs) => {
        res.send(bugs)
    })
})



//ADD
app.post('/api/bug', (req, res) => {
    const { title, severity, maker } = req.body
    const bug = {
        title,
        severity,
        maker
    }
    bugService.save(bug)
        .then(savedBug => {
            res.send(savedBug)
        })
})


//Get Bug 
app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.getById(bugId)
        .then(bug => {
            var visitedBugs = req.cookies.visitedBugs || []
            visitedBugs.push(bugId)
            visitedBugs = [...new Set(visitedBugs)]
            res.cookie('visitedBugs', visitedBugs, { maxAge: 7000 })
            if (visitedBugs.length > 3) {
                return res.status(401).send('Wait for a bit')
            }
            res.send(bug)
        })
})


// DELETE
app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    bugService.remove(bugId).then(() => {
        res.send('Removed!')
    })
})

// UPDATE
app.put('/api/bug/:bugId', (req, res) => {
    // TODO: EXPRESS.JSON()
    const { title, severity, _id, maker } = req.body

    const bug = {
        _id,
        title,
        severity,
        maker
    }
    bugService.save(bug).then((savedBug) => {
        res.send(savedBug)
    })
})

// LOGIN
app.post('/api/auth/login', (req, res) => {
    userService.checkLogin(req.body)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)

            } else {
                res.status(401).send('Invalid login')
            }
        })
})
// SIGNUP
app.post('/api/auth/signup', (req, res) => {
    userService.save(req.body)
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
})

// LOGOUT
app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('logged out')
})

const PORT = process.env.PORT || 3030

app.listen(PORT, () =>
    console.log(`Server listening on port http://127.0.0.1:${PORT}/`)
)




app.listen(3000, () => console.log('Server listening on port 3000!'))
