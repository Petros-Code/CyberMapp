import dotenv from 'dotenv'
dotenv.config()

import app from './app.js'
import './config/db.js'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Serveur bien démarré sur http://localhost:${PORT}`)
})