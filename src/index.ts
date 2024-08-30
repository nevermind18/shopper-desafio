import express from 'express';
import routes from "./routes/routes"
import 'dotenv/config'
import {runMongo} from "./database/mongo-cnnct";
import notFound from './middleware/notFound';

const port: string = process.env.PORT || '3000'

const app = express()

routes(app)
app.use(notFound);
runMongo()

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})