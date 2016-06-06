local redis = require "resty.redis_iresty"
local json = require "cjson"
local resources = ngx.var.resources
ngx.header.content_type ='application/json'
local red = redis:new()
local request_method = ngx.var.request_method

local qup= require "querystring"


local function api_list ()
    local res, err = red:hkeys("apiList")
    local result={
        status=0,
        msg="is okay",
        result=res
    }
    return result
end

local function api_edit (url)
    local res, err = red:hget("apiList",url)
    res=res or "{}"
    local result={
        status=0,
        msg="okay",
        result= json.decode(res)
    }
    return result
end

local function api_save (url,data)
    local ok, err = red:hset("apiList",url,data)
    local result={
        status=ok,
        msg="okay"
    }
    return result
end

local function api_del(url)
    local ok, err = red:hdel("apiList",url )
    local result={
        status=ok,
        msg="okay"
    }
    return result
end


if "GET" == request_method then
    local result={}
    local gets = ngx.req.get_uri_args()
    local x = gets.url or ""
    local url= qup.query_url_parse(gets.url or "")
    if string.find(resources,'api/list') then
        result=api_list()
    elseif  string.find(resources,'api/del') then
        if gets.apiItem ~= ngx.null then
            api_del(url)
            result=api_list ()
        end
    elseif  string.find(resources,'api/edit') then
        if  gets.url ~= ngx.null then
            result=api_edit(url)
        end
    end
    ngx.say(json.encode(result) )
end

if "POST" == request_method then
    ngx.req.read_body()
    local post,err= ngx.req.get_body_data()
    if string.find(resources,'api/save') then
        local x = json.decode(post)
        local url= x['url'] or ""
        api_save (qup.query_url_parse(url),json.encode(x["json"]))
        local result=api_list ()
        ngx.say(json.encode(result) )
    end
end
