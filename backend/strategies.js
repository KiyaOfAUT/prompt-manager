const models = require('./models')

class get_all_prompts_strategy{
    async process(request, response){
        const status = {};
        const prompts = await models.renderPrompts(["all"])
        if(prompts.length === 0){
            return status
        } else {
            let response_prompts = []
            for (let key in prompts) {
                let hold_prompt = {};
                hold_prompt['id'] = prompts[key].id;
                hold_prompt['title'] = prompts[key].title;
                hold_prompt['desc'] = prompts[key].description;
                hold_prompt['fav'] = prompts[key].favorite;
                response_prompts.push(hold_prompt)
            }
            status["prompts"]=response_prompts
            return status
        }
    }
}

class delete_strategy{
    async process(request, response){
        let hold = await models.renderPrompts(["single", request.body["id"]]);
        if(hold.length === 0){
            response.status(404)
            return {"message": "prompt not found."};
        } else {
            await hold[0].destroy();
            return {"message": "success"}
        }
    }
}
class patch_strategy{
    async process(request, response){
        let hold = await models.renderPrompts(["single", request.body["id"]]);
        if(hold.length === 0){
            response.status(404)
            return {"message": "prompt not found."};
        } else {
            if ("title" in request.body) {
               hold[0].title = request.body["title"]
            }
            if ("desc" in request.body) {
                hold[0].description = request.body["desc"]
            }
            if ("fav" in request.body) {
                hold[0].favorite = request.body["fav"]
            }
            await hold[0].save()
            return {"message": "success"}
        }
    }
}

class get_single_prompt_strategy{
    async process(request, response){
        const status = {}
        const hold = await models.renderPrompts(["single", request.body["id"]]);
        if(hold.length===0){
            response.status(404)
            return {"message": "prompt not found"}
        } else {
            status["id"] = hold[0].id
            status["title"] = hold[0].title
            status["desc"] = hold[0].description
            status["fav"] = hold[0].favorite
            return status
        }
    }
}
class post_prompt_strategy{
    async process(request, response){
        if("title" in request.body && "desc" in request.body && "fav" in request.body) {
            await models.prompt.create({title:request.body["title"],description:request.body["desc"], favorite:request.body["fav"]});
            return {"message": "posted successful"}
        } else {
            response.status(400)
            return {"message":"some of the required fields does not exist"}
        }
    }
}

module.exports = {get_all_prompts_strategy, post_prompt_strategy, delete_strategy, patch_strategy, get_single_prompt_strategy}