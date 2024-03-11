const http = require("http")
const fs = require("fs")
var requests = require('requests');

const homeFile = fs.readFileSync("index.html", "utf-8");

const replaceVal=(tempVal,orgVal)=>{
    let temperature=tempVal.replace("{%tempvalue%}",(orgVal.main.temp-273).toFixed(2))
     temperature=temperature.replace("{%tempmin%}",(orgVal.main.temp_min-273).toFixed(2))
     temperature=temperature.replace("{%tempmax%}",(orgVal.main.temp_max-273).toFixed(2))
     temperature=temperature.replace("{%Location%}",orgVal.name)
     temperature=temperature.replace("{%Country%}",orgVal.sys.country)
     return temperature
}


const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=hathras&appid=500f87f985030140dfef1c00c2234df3")
            .on('data', function (chunk) {
                const objData=JSON.parse(chunk)
                const arrData=[objData]
                // console.log(arrData[0].main.temp)
                const realTimeData=arrData.map(val=> replaceVal(homeFile,val)).join("")
                res.write(realTimeData)
                console.log(realTimeData)
            })
            .on('end', function (err) {
                if (err) return console.log('connection closed due to errors', err);
                res.end()
            });
    }
})

server.listen(8000,"127.0.0.1")
