apiMock
---
这是我自己用来模拟RESTFUL API的小工具。在需要在openresty环境下运行，需要使用redis作为数据存储。

抱歉，因为redis的原因对windows不友好。Linux下调试运行通过，Mac没有验证，应该是可以使用的。

### 安装openresty和redis
* 如何安装[openresty](http://openresty.org/en/installation.html)？请参见[http://openresty.org/en/installation.html](http://openresty.org/en/installation.html)。
* 如何安装[redis](https://github.com/antirez/redis)？请参见redis官方说明[README.md](https://github.com/antirez/redis/blob/unstable/README.md)。

### 如何配置
 1. 正确install OpenResty。
 1. 使用当前项目下的配置文件覆盖 ```$your_openresty_istall_path/nginx/```路径下的同名配置项。
 1. 确认redis运行在默认的端口下，暂时没有给redis设置口令。
 1. 正确启动当前openresty（nginx）。
 1. 浏览器中运行 ```http://127.0.0.1/admin/```。
    * 添加一个API(默认强制所有的api的路径都使用```/api```作为前缀)。
    * 编辑和保存一个API(添加api条目之后，点对应条目的编辑然后在左侧的json编辑区域里可以自由编辑json，然后点对应的保存)。
    * 删除一个API(从redis里删除hash里对应的key)
    * 保存成功之后可以测试是否保存成功。
        ```shell
        #例如我添加了一个 /api/test
        #使用如下命令可以得到该接口返回的json

        curl -XGET http://localhost/api/test

        ```
    * 然后需要配置一些`proxy_pass` 来对接你当前的项目，这个就要自己学习nginx相关的使用了。

 1. 注意！
    * 这只是一个简单的接口模拟，没有区分POST、GET等等http参数。
    * url上不要带查询参数，例如添加api的时候不要写类似 ```test?a=b&c=d&e=f```，而只要写```test```。为什么会这样呢？因为有个坑暂时还没想到怎么解决。
