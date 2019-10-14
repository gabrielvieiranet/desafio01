const express = require("express");

const server = express();
server.use(express.json());

const projects = [];
let totalReq = 0;

// Middleware - GLOBAL
server.use((req, res, next) => {
    totalReq++;
    console.log(`Requisições: ${totalReq}`);
    next();
});

// Middleware - Check Project In Array
function checkProjectInArray(req, res, next) {
    const { id } = req.params;
    const index = projects.findIndex(proj => proj.id == id);
    
    if(index == -1)
        return res.status(400).json('Project not found.');
    
    req.index = index;
    return next();
}

function checkIdExists(req, res, next) {
    const { id } = req.body;
    if(!id)
        return res.status(400).json({ error: 'id is required.'});
    
    const index = projects.findIndex(proj => proj.id === id);
    if(index != -1)
        return res.status(400).json({ error: 'This id aready exists. Try another'});

    return next();
}

function checkTitle(req, res, next) {
    if(!req.body.title)
        return res.status(400).json({ error: 'title is required.'});
    return next();
}

// Project - Create
server.post('/projects', checkIdExists, checkTitle, (req, res) => {
    const { id, title } = req.body;
    const newProject = {
        id,
        title,
        tasks: []
    };
    projects.push(newProject);
    res.json(newProject);
});

// Project - Read
server.get('/projects', (req, res) => {
    return res.json(projects);
});

// Project - Update
server.put('/projects/:id', checkProjectInArray, checkTitle, (req, res) => {
    projects[req.index].title = req.body.title;
    return res.json(projects[req.index]);
});

// Project - Delete
server.delete('/projects/:id', checkProjectInArray, (req, res) => {
    projects.splice(req.index, 1);
    return res.send();
});

// Task - Create
server.post('/projects/:id/tasks', checkProjectInArray, checkTitle, (req, res) => {
    projects[req.index].tasks.push(req.body.title);
    return res.json(projects[req.index]);
});

server.listen(3000);
