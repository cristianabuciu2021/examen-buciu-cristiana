const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT;
const sequelize = require('./sequelize');
const {Op} = require('sequelize');
const cors = require('cors');
const path = require('path');

const Spacecraft = require('./models/Spacecraft');
const Astronaut = require('./models/Astronaut');

Spacecraft.hasMany(Astronaut);

app.use(cors());
app.use(express.static(path.join(__dirname, 'build')))
app.use(bodyParser.json());
app.listen(port);

app.use((error, req, res, next) => {
    console.error(`[ERROR]: ${error}`);
    res.status(500).json(error);
})

// sync DB
app.put("/syncDB", async (req, res, next) => {
    try {
        await sequelize.sync({force: true});
        res.status(201).json({ message: 'created' })
    } catch (err) {
        next(err);
    }
});

// sync and clear DB
app.put("/syncClcDB", async (req, res, next) => {
    try {
        await sequelize.sync({force: true});
        res.status(201).json({ message: 'created' })
    } catch (err) {
        next(err);
    }
});


//request uri pentru Spacecraft

app.get("/spacecrafts", async (req, res, next) => {
    try {
        const query = {};
        const allowedFilters = ['maxSpeed', 'weight'];
        const filterKeys = Object.keys(req.query).filter(e => allowedFilters.indexOf(e) !== -1);
        if (filterKeys.length > 0) {
            query.where = {};
            for (const key of filterKeys) {
                query.where[key] = {[Op.gte]:`${req.query[key]}`};
            }
        }

        const sortField = req.query.sortField;
        let sortOrder = 'ASC'
        if (req.query.sortOrder && req.query.sortOrder === '-1') {
            sortOrder = 'DESC'
        }

        if (sortField) {
            query.order = [[sortField, sortOrder]]
          }

        let pageSize = 3;
        if (req.query.pageSize) {
            pageSize = parseInt(req.query.pageSize)
        }
        if (!isNaN(parseInt(req.query.page))) {
            query.limit = pageSize
            query.offset = pageSize * parseInt(req.query.page)
        }
        query.include = [Astronaut];
        const records = await Spacecraft.findAll(query);
        const count = await Spacecraft.count();
        res.status(200).json({records, count});
    } catch (err) {
        next(err);
    }
});

app.post("/spacecrafts", async (req, res, next) => {
    try {
        await Spacecraft.create(req.body);
        res.status(201).json({ message: 'created' })
    } catch (err) {
        next(err);
    }
});

app.put("/spacecrafts/:id", async (req, res, next) => {
    try {
        const spacecraft = await Spacecraft.findByPk(req.params.id);
        if (spacecraft) {
            await spacecraft.update(req.body);
            res.status(202).json({ message: 'updated' })
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (err) {
        next(err);
    }
});

app.delete("/spacecrafts/:id", async (req, res, next) => {
    try {
        const spacecraft = await Spacecraft.findByPk(req.params.id);
        if (spacecraft) {
            await spacecraft.destroy();
            res.status(202).json({ message: 'deleted' })
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (err) {
        next(err);
    }
});

//request uri pentru Astronaut

app.get("/spacecrafts/:spacecraftId/astronauts", async (req, res, next) => {
    try {
        const spacecraft = await Spacecraft.findByPk(req.params.spacecraftId);
        if (spacecraft) {
            const astronauts = await spacecraft.getAstronauts();
            res.status(200).json(astronauts);
        } else {
            res.status(404).json({ message: `spacecraft with id=${req.params.spacecraftId} not found` });
        }
    } catch (err) {
        next(err);
    }
});

app.post("/spacecrafts/:spacecraftId/astronauts", async (req, res, next) => {
    try {
        const spacecraft = await Spacecraft.findByPk(req.params.spacecraftId);
        if (spacecraft) {
            const astronaut = req.body;
            astronaut.spacecraftId = spacecraft.id;
            await Astronaut.create(astronaut);
            res.status(201).json({ message: 'created' })
        } else {
            res.status(404).json({ message: `spacecraft with id=${req.params.spacecraftId} not found` });
        }
    } catch (err) {
        next(err);
    }
});

app.put("/spacecrafts/:spacecraftId/astronauts/:astroId", async (req, res, next) => {
    try {
        const spacecraft = await Spacecraft.findByPk(req.params.spacecraftId);
        if (spacecraft) {
            const astronauts = await spacecraft.getAstronauts({ where: {id : req.params.astroId}});
            const astronaut = astronauts.shift();
            if (astronaut) {
                await astronaut.update(req.body);
                res.status(202).json({ message: 'updated' })
            } else {
                res.status(404).json({ message: `astro with id=${req.params.astroId} not found` });
            }
        } else {
            res.status(404).json({ message: `spacecraft with id=${req.params.spacecraftId} not found` });
        }
    } catch (err) {
        next(err);
    }
});

app.delete("/spacecrafts/:spacecraftId/astronauts/:astroId", async (req, res, next) => {
    try {
        const spacecraft = await Spacecraft.findByPk(req.params.spacecraftId);
        if (spacecraft) {
            const astronauts = await spacecraft.getAstronauts({ where: {id : req.params.astroId}});
            const astronaut = astronauts.shift();
            if (astronaut) {
                await astronaut.destroy();
                res.status(202).json({ message: 'deleted' })
            } else {
                res.status(404).json({ message: `astro with id=${req.params.astroId} not found` });
            }
        } else {
            res.status(404).json({ message: `spacecraft with id=${req.params.spacecraftId} not found` });
        }
    } catch (err) {
        next(err);
    }
});