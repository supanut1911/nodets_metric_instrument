import express, { Request, Response } from 'express';
import client, { register } from 'prom-client'
const app = express();
const port = 8899;


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

//create custom counter
const headCounter = new client.Counter({
  name: "head_counter",
  help: "total number of head",
  labelNames: ["method", "path", 'status_code']
})

//create custom gague
const temperatureGague = new client.Gauge({
  name: "temperature_gague",
  help: "temerature gague",
  labelNames: ['room']
})

const tailCounter = new client.Counter({
  name: "tail_counter",
  help: "total number of tail",
  labelNames: ["method", "path", 'status_code']
})

const flipCounter = new client.Counter({
  name: "flip_counter",
  help: "total number of flip",
  labelNames: ["method", "path", 'status_code']
})

register.registerMetric(headCounter)
register.registerMetric(tailCounter)
register.registerMetric(flipCounter)
register.registerMetric(temperatureGague)
register.setDefaultLabels({
  app: 'coin-api'
})

//enable collec default metric
const collectDefaultMetrics =  client.collectDefaultMetrics
collectDefaultMetrics({ register })

setInterval(() => {
  const rooms = ["office", "lab", "bathroom"]
  rooms.forEach((room) => {
    const temperature = Math.random() * 10 + 20
    temperatureGague.set({room},temperature)
  })
}, 5000);


app.get('/', (req: Request, res: Response) => {
  res.send('Hello TypeScript + Express!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.get('/flip-coin', (req: express.Request, res: express.Response)=> {
  const times = Number(req.query.times);
  
  flipCounter.inc(times)
  if (times && (times > 0)) {
    let heads = 0
    let tails = 0
    for (let i = 0; i < times; i++) {
        let randomNumber = Math.random()
        if(randomNumber < 0.5) {
          heads++
          
        } else {
        
          tails++
        }
    }
    headCounter.inc(heads)
    tailCounter.inc(tails)
    res.json({
      heads,
      tails
    })
  } else { 
    res.send("input times")
  }
})

app.get("/metrics", async(req, res) => {
  res.setHeader("Content-type", register.contentType)
  res.end(await register.metrics())
})

app.get('/inc', (req, res) => {
  headCounter.inc()
  res.send("inc")
})