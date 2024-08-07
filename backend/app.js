class prompt{
    constructor(id, title, desc, fav) {
        this.id = id
        this.title = title;
        this.desc = desc;
        this.fav = fav
    }
}
let id = 0
class get_all_prompts_strategy{
    process(request, response){
        const status = {};
        if(prompts.length === 0){
            return status
        } else {
            let response_prompts = []
            for (let key in prompts) {
                let hold_prompt = {};
                hold_prompt['id'] = prompts[key].id;
                hold_prompt['title'] = prompts[key].title;
                hold_prompt['desc'] = prompts[key].desc;
                hold_prompt['fav'] = prompts[key].fav;
                response_prompts.push(hold_prompt)
            }
            status["prompts"]=response_prompts
            return status
        }
    }
}

class delete_strategy{
    process(request, response){
        delete prompts[request.body["id"]]
        return {"message": "success"}
    }
}
class patch_strategy{
    process(request, response){
        console.log(request.body)
        if("title" in request.body){
            prompts[request.body["id"]].title = request.body["title"]
        }
        if("desc" in request.body){
            prompts[request.body["id"]].desc = request.body["desc"]
        }
        if("fav" in request.body){
            prompts[request.body["id"]].fav = request.body["fav"]
        }
        return {"message": "success"}
    }
}

class get_single_prompt_strategy{
    process(request, response){
        const status = {}
        let hold = prompts[request.body["id"]]
        status["id"] = hold.id
        status["title"] = hold.title
        status["desc"] = hold.desc
        status["fav"] = hold.fav
        return status
    }
}
class post_prompt_strategy{
    process(request, response){
        if("title" in request.body && "desc" in request.body && "fav" in request.body) {
            prompts[id] = new prompt(id, request.body['title'], request.body['desc'], request.body['fav']);
            id++;
            return {"message": "posted successful"}
        } else {
            response.status(400)
            return {"message":"some of the required fields does not exist"}
        }
    }
}
class request_process{
    constructor(strategy) {
    this.strategy = new strategy()
    }

    process(request, response){
        return this.strategy.process(request, response)
    }
}
const express = require('express');
const cors = require('cors')
const app = express();
app.use(express.json());
app.use(cors())
const PORT=process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server is Listening on PORT:", PORT);
});
let prompts = {}

app.route("/prompts").all((request, response, next)=>{
    if(request.method === "GET"){
        response.send((new request_process(get_all_prompts_strategy)).process(request, response));
    } else if(request.method === "POST"){
        response.send((new request_process(post_prompt_strategy)).process(request, response))
    } else response.status(400).send({"message":"method not supported"})
})

app.route("/prompt/:id").all((request, response, next)=>{
    const id = request.params.id;
    request.body['id'] = id;
    if(request.method === "GET" || request.method === "PATCH" || request.method === "DELETE") {
        if (id in prompts) {
            if (request.method === "GET") {
                response.send((new request_process(get_single_prompt_strategy)).process(request, response))
            } else if (request.method === "PATCH") {
                response.send((new request_process(patch_strategy)).process(request, response))
            } else if (request.method === "DELETE") {
                response.send((new request_process(delete_strategy)).process(request, response))
            }
        } else {
            response.status(404).send({"message": "prompt doesnt exist"})
        }
    } else {
        response.status(400).send({"message": "method not supported"})
    }

})
