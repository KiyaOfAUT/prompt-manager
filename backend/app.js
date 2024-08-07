const express = require('express');
const cors = require('cors')
const strategies = require('./strategies');


const app = express();
const PORT=process.env.PORT || 3000;



class request_process{
    constructor(strategy) {
    this.strategy = new strategy()
    }

    async process(request, response){
        return await this.strategy.process(request, response)
    }
}



app.use(express.json());
app.use(cors())
app.listen(PORT, () => {
    console.log("Server is Listening on PORT:", PORT);
});


let prompts = {}

app.route("/prompts").all(async (request, response, next) =>{
    if(request.method === "GET"){
        let hold = await (new request_process(strategies.get_all_prompts_strategy)).process(request, response)
        response.send(hold);
    } else if(request.method === "POST"){
        let hold = await (new request_process(strategies.post_prompt_strategy)).process(request, response)
        response.send(hold)
    } else response.status(400).send({"message":"method not supported"})
})

app.route("/prompt/:id").all(async (request, response, next)=>{
    const id = request.params.id;
    request.body['id'] = id;
    if(request.method === "GET" || request.method === "PATCH" || request.method === "DELETE") {
        if (request.method === "GET") {
            let hold = await (new request_process(strategies.get_single_prompt_strategy)).process(request, response)
            response.send(hold)
        } else if (request.method === "PATCH") {
            let hold = await (new request_process(strategies.patch_strategy)).process(request, response)
            response.send(hold)
        } else if (request.method === "DELETE") {
            let hold = await (new request_process(strategies.delete_strategy)).process(request, response)
            response.send(hold)
        }
    } else {
        response.status(400).send({"message": "method not supported"})
    }
})
