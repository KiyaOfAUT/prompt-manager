class prompt{
    constructor(id, title, desc, fav) {
        this.id = id
        this.title = title;
        this.desc = desc;
        this.fav = fav
    }
}
let id = 0

const express = require('express');
const app = express();
app.use(express.json());
const PORT=process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("Server is Listening on PORT:", PORT);
});
let prompts = {}

app.route("/prompts").all((request, response, next)=>{
    if(request.method === "GET"){
        const status = {};
        if(prompts.length === 0){
            response.send(status)
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
        }
        response.send(status);
    } else if(request.method === "POST"){
        if("title" in request.body && "desc" in request.body && "fav" in request.body) {
            prompts[id] = new prompt(id, request.body['title'], request.body['desc'], request.body['fav']);
            id++;
            response.send({"message": "posted successful"});
        } else {
            response.status(400).send({"message":"some of the required fields does not exist"})
        }
    } else response.status(400).send({"message":"method not supported"})
})

app.route("/prompt").all((request, response, next)=>{
    if("id" in request.body) {
        if (request.body["id"] in prompts) {
            if (request.method === "GET") {
                const status = {}
                let hold = prompts[request.body["id"]]
                status["id"] = hold.id
                status["title"] = hold.title
                status["desc"] = hold.desc
                status["fav"] = hold.fav
                response.send(status)
            } else if (request.method === "PATCH") {
                if("title" in request.body){
                    prompts[request.body["id"]].title = request.body["title"]
                }
                if("desc" in request.body){
                    prompts[request.body["id"]].desc = request.body["desc"]
                }
                if("fav" in request.body){
                    prompts[request.body["id"]].fav = request.body["fav"]
                }
                response.send({"message": "success"})
            } else if (request.method === "DELETE"){
                delete prompts[request.body["id"]]
                response.send({"message": "success"})
            } else {
                response.status(400).send({"message":"method not supported"})
            }
        } else {
            response.status(404).send({"message": "prompt doesnt exist"})
        }
    } else {
        response.status(400).send({"message": "id not determined"})
    }
})
