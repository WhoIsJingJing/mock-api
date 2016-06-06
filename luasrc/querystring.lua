local _M = {
    _VERSION = '0.0.1'
}
local mt = { __index = _M }

local json = require "cjson"

function  _M.query_url_parse(url)
    local result_url=url
    if string.find(url,'?') then
        local l_uri = string.sub(url,1,string.find(url,'?')-1)
        local l_args = string.sub(url,string.find(url,'?')+1)
        local t_args = ngx.decode_args(l_args,0)
        table.sort(t_args)
        local temp_args=json.decode(json.encode(t_args))
        local n_args = ngx.encode_args(temp_args)
        result_url = l_uri .. '?' .. n_args
    end
    return result_url
end


return _M
