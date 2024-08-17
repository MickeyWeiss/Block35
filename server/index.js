const {client, createTables, createUser, createProduct, fetchUsers, fetchProducts, createFavorites, fetchFavorites, deleteFavorite } = require('./db.js');
const express = require('express');
const app = express();
const port = process.env.PORT || '3000';
app.listen(port, () => console.log(`listening on port ${port}`))

app.get('/api/users', async (req, res, next) => {
    try {
        res.send(await fetchUsers())
    }catch (error){
        next(error)
    }
})

app.get('/api/products', async (req, res, next) => {
    try {
        res.send(await fetchProducts())
    }catch (error) {
        next(error)
    }
})

app.get('/api/users/:id/favorites', async (req, res, next) => {
    try {
        res.send(await fetchFavorites(req.params.id))
    }catch (error) {
        next(error)
    }
})

app.post('/api/users/:id/favorites', async (req, res, next) => {
    try {
        res.status(201).send (await createFavorites ({user_id: req.params.id, product_id: req.body.product_id}))
    }catch (error) {
        next (error)
    }
})

app.delete('/api/users/:userID/favorites/:id', async (req, res, next) => {
    try {
        await deleteFavorite({id: req.params.id, user_id: req.params.userID})
        res.sendStatus(204)
    }catch (error) {
        next (error)
    }
})

const init = async () => {
    await client.connect();
    console.log('connected to the database')
    await createTables();
    console.log('tables created')

    const [mickey, rebecca, elijah, romeo, ophelia, computer, phone, toy, fish, mouse] = await Promise.all([
        createUser({username: 'mickey', password: '1234'}),
        createUser({username: 'rebecca', password: '5678'}),
        createUser({username: 'elijah', password: '9101112'}),
        createUser({username: 'romeo', password: 'mew'}),
        createUser({username: 'ophelia', password: 'meeewww'}),
        createProduct({name: 'computer'}),
        createProduct({name: 'phone'}),
        createProduct({name: 'toy'}),
        createProduct({name: 'fish'}),
        createProduct({name: 'mouse'}),
    ])

    const users = await fetchUsers()
    console.log(users)
    const products = await fetchProducts()
    console.log(products)

    const favorites = await Promise.all([
        createFavorites({user_id: mickey.id, product_id: computer.id}),
        createFavorites({user_id: rebecca.id, product_id: phone.id}),
        createFavorites({user_id: elijah.id, product_id: toy.id}),
        createFavorites({user_id: romeo.id, product_id: fish.id}),
        createFavorites({user_id: ophelia.id, product_id: mouse.id}),
    ]);
    console.log(await fetchFavorites(mickey.id))
    await deleteFavorite(favorites[0].id)
    console.log(await fetchFavorites(mickey.id))


}
init()