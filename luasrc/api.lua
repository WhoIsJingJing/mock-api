local redis = require "resty.redis_iresty"
local json = require "cjson"
local resources = ngx.var.resources or ""
ngx.header.content_type ='application/json'
local red = redis:new()
local url='/api'..resources
local qup= require "querystring"
local l_args = ngx.var.args

-- if ngx.null ~= l_args then
--     url=url..'?'.. l_args
-- end
local l_url=qup.query_url_parse(url)
local res, err = red:hget("apiList",l_url)
if res ~= ngx.null then
    ngx.say(res or "{}")
    return
end
