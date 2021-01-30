const express = require('express');
const auth = require('../../middlewares/auth')
const ApiError = require('../../errors/ApiError');
const controller = require('../../controllers/utils/controller');

module.exports = (Collection, {noCreate, noCreateMany, noList, noGet, noSearch, noUpdate, noCount, noDelete, needAuth} = {}) => {

    const create = controller(async ({body}, res) => {
        const result = new Collection({...body});
        if(result) await result.save();
        res.status(201).json(result);
    });

    const createMany = controller(async ({body: {collections}}, res) => {
        const result = await Collection.insertMany(collections);
        if(result) await result.save();
        res.status(201).json(result);
    });

    const list = controller(async ({query}, res) => {
        console.log(query)
        const result = await Collection.find(query);
        res.json(result);
    });

    const search = controller(async ({params}, res) => {
        const list = await Collection.find({$text: { $search: params.query }});
        res.json(list);
    });

    const count = controller(async (req, res) => {
        const count = await Collection.count();
        res.json(count);
    });

    const get = controller(async ({params: {id: _id}}, res) => {
        const result = await Collection.findOne({_id});
        if(!result) throw ApiError('Ressource Not found', 404)
        res.json(result);
    });

    const update = controller(async ({params: {id: _id}, body}, res) => {
        await Collection.updateOne({_id}, {...body});
        res.status(200).end();
    });

    const remove = controller(async ({params: {id: _id}}, res) => {
        await Collection.deleteOne({_id});
        res.status(200).end();
    });

    const router = express.Router();

    if(needAuth) router.use(auth);

    !noList && router.get('/', list);
    !noCount && router.get('/count', count);
    !noSearch && router.get('/search/:query', search);
    !noGet && router.get('/:id', get);
    !noCreate && router.post('/', create);
    !noCreateMany && router.post('/many', createMany);
    !noUpdate && router.put('/:id', update);
    !noDelete && router.delete('/:id', remove);
    return router;
}